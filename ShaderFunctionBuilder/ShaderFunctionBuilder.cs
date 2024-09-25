using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using Newtonsoft.Json;

namespace ShaderFunctionBuilder
{
    public partial class ShaderFunctionBuilder : Form
    {
        private DirectoryInfo workspace;
        private FileInfo[] files;
        private ShaderFunction function;
        private ShaderFunction cachedFunction;
        private bool dirty;
        private bool openningFile;

        public ShaderFunctionBuilder()
        {
            InitializeComponent();

            workspace = GetWorkspace("functions");
            LoadFiles();
        }

        private void LoadFiles()
        {
            //Load files
            files = workspace.GetFiles();
            fileList.Items.Clear();
            for (int i = 0; i < files.Length; i++)
            {
                fileList.Items.Add(files[i].Name);
            }

            //Open first file
            if (files.Length > 0)
                fileList.SelectedIndex = 0;
        }

        private ShaderExample GetCurrentExample()
        {
            int index = exampleTabs.SelectedIndex;
            if (index < 0 || index >= function.examples.Length)
                return default;

            return function.examples[index];
        }

        private void SetCurrentExample(ShaderExample example)
        {
            int index = exampleTabs.SelectedIndex;
            if (index < 0 || index >= function.examples.Length)
                return;

            function.examples[index] = example;
        }

        private ShaderProperty GetCurrentProperty()
        {
            int index = propertyList.SelectedIndex;
            ShaderExample example = GetCurrentExample();
            if (index < 0 || index >= example.properties.Length)
                return default;

            return example.properties[index];
        }

        private void SetCurrentProperty(ShaderProperty property)
        {
            int index = propertyList.SelectedIndex;
            ShaderExample example = GetCurrentExample();
            if (index < 0 || index >= example.properties.Length)
                return;

            example.properties[index] = property;
            SetCurrentExample(example);
        }

        private void OnSelectFile(object sender, EventArgs e)
        {
            OpenFile(files[fileList.SelectedIndex]);
        }

        private void OnSelectTab(object sender, EventArgs e)
        {
            int index = exampleTabs.SelectedIndex;
            if (index < 0 || function.examples == null ||  index >= function.examples.Length)
                return;

            OpenExample(function.examples[exampleTabs.SelectedIndex]);
        }

        private void OpenFile(FileInfo file)
        {
            SaveBeforeChange();
            openningFile = true;

            string jsonFile = File.ReadAllText(file.FullName);
            function = JsonConvert.DeserializeObject<ShaderFunction>(jsonFile);
            cachedFunction = function;

            //Set function infos
            fileTitle.Text = file.Name;
            functionNameField.Text = function.name;
            functionTagsField.Text = function.tags;
            functionDescriptionField.Text = function.description;
            indexDescriptionField.Text = function.indexDescription;
            indexShaderField.Text = function.indexShader;

            //Set examples info
            exampleTabs.TabPages.Clear();

            //Add one example if none
            if (function.examples == null || function.examples.Length == 0)
            {
                function.examples = new ShaderExample[] { new ShaderExample() { name = "Example" } };
            }

            for (int i = 0; i < function.examples.Length; i++)
            {
                ShaderExample example = function.examples[i];

                exampleTabs.TabPages.Add(example.name);
            }
            exampleTabs.SelectedIndex = 0;
            OnSelectTab(null, null);
            openningFile = false;
        }

        private void OpenExample(ShaderExample example)
        {
            //Example
            exampleNameField.Text = example.name;
            exampleDescriptionField.Text = example.description;
            exampleCodeField.Text = example.code;
            exampleShaderField.Text = example.shader;

            //Properties
            propertyList.Items.Clear();
            if (example.properties != null)
            {
                for (int i = 0; i < example.properties.Length; i++)
                {
                    string name = example.properties[i].name;
                    if (string.IsNullOrEmpty(name))
                        name = "unamed";

                    propertyList.Items.Add(name);
                }
            }
        }

        private DirectoryInfo GetWorkspace(string workspaceName)
        {
            DirectoryInfo currentDir = new DirectoryInfo("..");
            bool validDir = false;
            while (!validDir && currentDir.Parent != null)
            {
                DirectoryInfo[] dirInfos = currentDir.GetDirectories();

                for (int i = 0; i < dirInfos.Length; i++)
                {
                    if (dirInfos[i].Name == workspaceName)
                        return dirInfos[i];
                }

                currentDir = currentDir.Parent;
            }

            return null;
        }

        private void NewFunction(object sender, EventArgs e)
        {
            SaveBeforeChange();

            string name = Prompt.ShowDialog("Function name", "Create new function...");
            string fileName = name.ToLower();

            if (!fileName.EndsWith(".json"))
                fileName += ".json";

            ShaderFunction newFunction = new ShaderFunction() { name = name };
            string filepath = workspace.FullName + "\\" + fileName;
            MessageBox.Show(filepath);

            string jsonFile = JsonConvert.SerializeObject(newFunction, Formatting.Indented);

            File.WriteAllText(filepath, jsonFile);
            LoadFiles();

            //Select new file
            for (int i = 0; i < files.Length; i++)
            {
                if (files[i].Name == fileName)
                {
                    fileList.SelectedIndex = i;
                    OnSelectFile(null, null);
                    break;
                }
            }
        }

        private void SaveBeforeChange()
        {
            //if (!dirty)
            //    return;

            //Prompt.ShowSaveDialog("There are unsaved changes", "Unsaved changes", "Save", "Revert");

            //dirty = false;
        
        }

        private void SaveIndex()
        {
            FunctionCollection collection = new FunctionCollection();
            collection.functions = files.ToList().Select(x => GetInfo(x)).ToArray();

            string filepath = workspace.Parent.FullName + "\\functions.json";
            JsonSerializerSettings settings = new JsonSerializerSettings();
            string jsonFile = JsonConvert.SerializeObject(collection, Formatting.Indented);
            File.WriteAllText(filepath, jsonFile);
        }

        private FunctionInfo GetInfo(FileInfo fileInfo)
        {
            string jsonFile = File.ReadAllText(fileInfo.FullName);
            ShaderFunction function = JsonConvert.DeserializeObject<ShaderFunction>(jsonFile);

            return new FunctionInfo()
            {
                filename = fileInfo.Name,
                name = function.name,
                tags = function.tags,
                description = function.indexDescription,
                previewShader = function.indexShader
            };
        }

        #region Field changes
        private void OnChangeFunction(object sender, EventArgs e)
        {
            if (openningFile)
                return;

            function.name = functionNameField.Text;
            function.tags = functionTagsField.Text;
            function.description = functionDescriptionField.Text;
            function.indexDescription = indexDescriptionField.Text;
            function.indexShader = indexShaderField.Text;
            SetDirty();
        }

        private void OnChangeExampleName(object sender, EventArgs e)
        {
            if (openningFile)
                return;

            int index = exampleTabs.SelectedIndex;
            if (index < 0 || index >= function.examples.Length)
                return;

            exampleTabs.TabPages[index].Text = exampleNameField.Text;

            function.examples[index].name = exampleNameField.Text;
            SetDirty();
        }

        private void OnChangeExampleDescription(object sender, EventArgs e)
        {
            if (openningFile)
                return;

            int index = exampleTabs.SelectedIndex;
            if (index < 0 || index >= function.examples.Length)
                return;

            function.examples[index].description = exampleDescriptionField.Text;
            SetDirty();
        }

        private void OnChangeExampleCode(object sender, EventArgs e)
        {
            if (openningFile)
                return;

            int index = exampleTabs.SelectedIndex;
            if (index < 0 || index >= function.examples.Length)
                return;

            function.examples[index].code = exampleCodeField.Text;
            SetDirty();
        }

        private void OnChangeExampleShader(object sender, EventArgs e)
        {
            if (openningFile)
                return;

            int index = exampleTabs.SelectedIndex;
            if (index < 0 || index >= function.examples.Length)
                return;

            function.examples[index].shader = exampleShaderField.Text;
            SetDirty();
        }

        #endregion

        #region Function management
        private void Save(object sender, EventArgs e)
        {
            string filepath = files[fileList.SelectedIndex].FullName;
            string jsonFile = JsonConvert.SerializeObject(function, Formatting.Indented);
            File.WriteAllText(filepath, jsonFile);
            SaveIndex();
        }

        private void Revert(object sender, EventArgs e)
        {
            OpenFile(files[fileList.SelectedIndex]);
        }

        private void SetDirty()
        {
            if (cachedFunction.Equals(function))
                return;

            dirty = true;
        }
        #endregion

        #region Example management
        private void MoveExampleToLeft(object sender, EventArgs e)
        {
            int index = exampleTabs.SelectedIndex;
            if (index <= 0 || index >= function.examples.Length || function.examples.Length == 1)
                return;

            int otherIndex = index - 1;
            (function.examples[index], function.examples[otherIndex]) = (function.examples[otherIndex], function.examples[index]);
            (exampleTabs.TabPages[index].Text, exampleTabs.TabPages[otherIndex].Text) = (exampleTabs.TabPages[otherIndex].Text, exampleTabs.TabPages[index].Text);
            exampleTabs.SelectTab(otherIndex);
            SetDirty();
        }

        private void MoveExampleToRight(object sender, EventArgs e)
        {
            int index = exampleTabs.SelectedIndex;
            if (index < 0 || index >= function.examples.Length - 1 || function.examples.Length == 1)
                return;

            int otherIndex = index + 1;
            (function.examples[index], function.examples[otherIndex]) = (function.examples[otherIndex], function.examples[index]);
            (exampleTabs.TabPages[index].Text, exampleTabs.TabPages[otherIndex].Text) = (exampleTabs.TabPages[otherIndex].Text, exampleTabs.TabPages[index].Text);
            exampleTabs.SelectTab(otherIndex);
            SetDirty();
        }

        private void DeleteExample(object sender, EventArgs e)
        {
            int index = exampleTabs.SelectedIndex;
            if (index < 0 || index >= function.examples.Length)
                return;

            List<ShaderExample> examples = function.examples.ToList();
            examples.RemoveAt(index);
            if (examples == null)
                examples.Add(new ShaderExample());
            function.examples = examples.ToArray();
            exampleTabs.TabPages.RemoveAt(index);
            exampleTabs.SelectTab(Math.Max(0, index - 1));
            SetDirty();
        }

        private void AddExample(object sender, EventArgs e)
        {
            List<ShaderExample> examples = function.examples.ToList();
            examples.Add(new ShaderExample() { name = "New" });
            function.examples = examples.ToArray();
            exampleTabs.TabPages.Add("New");
            exampleTabs.SelectTab(examples.Count - 1);
            SetDirty();
        }
        #endregion

        #region Properties management

        private void SelectProperty(object sender, EventArgs e)
        {
            ShaderProperty property = GetCurrentProperty();
            propertyNameField.Text = property.name;
            propertyShaderNameField.Text = property.id;
            propertyValueField.Text = property.value;
            propertyMinField.Text = property.min;
            propertyMaxField.Text = property.max;
            propertyTypeLabel.Text = "Property type : " + property.type;

            switch (property.type)
            {
                case "range":
                    propertyMinField.Visible = true;
                    propertyMaxField.Visible = true;
                    break;

                case "toggle":
                    propertyMinField.Visible = false;
                    propertyMaxField.Visible = false;
                    break;

                case "color":
                    propertyMinField.Visible = false;
                    propertyMaxField.Visible = false;
                    break;
            }
        }

        private void MoveUpProperty(object sender, EventArgs e)
        {
            ShaderExample example = GetCurrentExample();
            if (example.properties == null)
                example.properties = new ShaderProperty[0];

            int index = propertyList.SelectedIndex;
            if (index <= 0 || index >= example.properties.Length || example.properties.Length == 1)
                return;

            int otherIndex = index - 1;

            (example.properties[index], example.properties[otherIndex]) = (example.properties[otherIndex], example.properties[index]);
            (propertyList.Items[index], propertyList.Items[otherIndex]) = (propertyList.Items[otherIndex], propertyList.Items[index]);
            
            propertyList.SelectedIndex = otherIndex;
            SelectProperty(null, null);
            SetCurrentExample(example);
            SetDirty();
        }

        private void MoveDownProperty(object sender, EventArgs e)
        {
            ShaderExample example = GetCurrentExample();
            if (example.properties == null)
                example.properties = new ShaderProperty[0];

            int index = propertyList.SelectedIndex;
            if (index < 0 || index >= (example.properties.Length - 1) || example.properties.Length == 1)
                return;

            int otherIndex = index + 1;

            (example.properties[index], example.properties[otherIndex]) = (example.properties[otherIndex], example.properties[index]);
            (propertyList.Items[index], propertyList.Items[otherIndex]) = (propertyList.Items[otherIndex], propertyList.Items[index]);
            
            propertyList.SelectedIndex = otherIndex;
            SelectProperty(null, null);
            SetCurrentExample(example);
            SetDirty();
        }

        private void RemoveProperty(object sender, EventArgs e)
        {
            ShaderExample example = GetCurrentExample();
            if (example.properties == null)
                example.properties = new ShaderProperty[0];

            int index = propertyList.SelectedIndex;
            if (index < 0 || index >= example.properties.Length)
                return;

            List<ShaderProperty> properties = example.properties.ToList();
            properties.RemoveAt(index);
            example.properties = properties.ToArray();
            propertyList.Items.RemoveAt(index);

            SetCurrentExample(example);
            if (properties.Count > 0)
            {
                propertyList.SelectedIndex = Math.Max(index - 1, 0);
                SelectProperty(null, null);
            }
            SetDirty();
        }

        private void CreateProperty(object sender, EventArgs e)
        {
            Rectangle rect = createPropertyBtn.Bounds;
            Point point = new Point(0, rect.Height);
            point = createPropertyBtn.PointToScreen(point);
            createPropertyContextMenu.Show(point);
        }

        private void OnCreateProperty(object sender, ToolStripItemClickedEventArgs e)
        {
            string type = e.ClickedItem.Text.ToLower();

            ShaderExample example = GetCurrentExample();
            if (example.properties == null)
                example.properties = new ShaderProperty[0];

            List<ShaderProperty> properties = example.properties.ToList();
            properties.Add(new ShaderProperty() { type = type, name = "NewProperty" });
            example.properties = properties.ToArray();

            SetCurrentExample(example);
            propertyList.Items.Add("NewProperty");
            propertyList.SelectedIndex = properties.Count - 1;
            SelectProperty(null, null);
            SetDirty();
        }

        private void OnPropertyChanged(object sender, EventArgs e)
        {
            ShaderProperty property = GetCurrentProperty();
            property.name = propertyNameField.Text;
            property.id = propertyShaderNameField.Text;
            property.value = propertyValueField.Text;
            property.min = propertyMinField.Text;
            property.max = propertyMaxField.Text;
            SetCurrentProperty(property);
            SetDirty();
        }


        #endregion

        private void button4_Click(object sender, EventArgs e)
        {
            DialogResult result = colorPicker.ShowDialog();
            MessageBox.Show(result + "  " + colorPicker.Color);
        }
    }
}
