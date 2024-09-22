namespace ShaderFunctionBuilder
{
    partial class Form1
    {
        /// <summary>
        /// Variable nécessaire au concepteur.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Nettoyage des ressources utilisées.
        /// </summary>
        /// <param name="disposing">true si les ressources managées doivent être supprimées ; sinon, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Code généré par le Concepteur Windows Form

        /// <summary>
        /// Méthode requise pour la prise en charge du concepteur - ne modifiez pas
        /// le contenu de cette méthode avec l'éditeur de code.
        /// </summary>
        private void InitializeComponent()
        {
            this.components = new System.ComponentModel.Container();
            this.splitContainer1 = new System.Windows.Forms.SplitContainer();
            this.button1 = new System.Windows.Forms.Button();
            this.fileList = new System.Windows.Forms.ListBox();
            this.panel1 = new System.Windows.Forms.Panel();
            this.newExampleBtn = new System.Windows.Forms.Button();
            this.deleteExampleBtn = new System.Windows.Forms.Button();
            this.moveLeftBtn = new System.Windows.Forms.Button();
            this.revertBtn = new System.Windows.Forms.Button();
            this.moveRightBtn = new System.Windows.Forms.Button();
            this.saveBtn = new System.Windows.Forms.Button();
            this.label1 = new System.Windows.Forms.Label();
            this.functionTagsField = new System.Windows.Forms.TextBox();
            this.panel2 = new System.Windows.Forms.Panel();
            this.propertyMaxField = new System.Windows.Forms.TextBox();
            this.propertyMinField = new System.Windows.Forms.TextBox();
            this.propertyValueField = new System.Windows.Forms.TextBox();
            this.propertyShaderNameField = new System.Windows.Forms.TextBox();
            this.propertyNameField = new System.Windows.Forms.TextBox();
            this.label13 = new System.Windows.Forms.Label();
            this.label12 = new System.Windows.Forms.Label();
            this.label11 = new System.Windows.Forms.Label();
            this.label10 = new System.Windows.Forms.Label();
            this.label9 = new System.Windows.Forms.Label();
            this.button3 = new System.Windows.Forms.Button();
            this.button2 = new System.Windows.Forms.Button();
            this.moveUpProperty = new System.Windows.Forms.Button();
            this.propertyList = new System.Windows.Forms.ListBox();
            this.createPropertyBtn = new System.Windows.Forms.Button();
            this.label8 = new System.Windows.Forms.Label();
            this.exampleShaderField = new System.Windows.Forms.TextBox();
            this.label7 = new System.Windows.Forms.Label();
            this.exampleCodeField = new System.Windows.Forms.TextBox();
            this.label6 = new System.Windows.Forms.Label();
            this.label4 = new System.Windows.Forms.Label();
            this.exampleDescriptionField = new System.Windows.Forms.TextBox();
            this.exampleNameField = new System.Windows.Forms.TextBox();
            this.label5 = new System.Windows.Forms.Label();
            this.exampleTabs = new System.Windows.Forms.TabControl();
            this.tabPage2 = new System.Windows.Forms.TabPage();
            this.fileTitle = new System.Windows.Forms.Label();
            this.functionDescriptionField = new System.Windows.Forms.TextBox();
            this.label2 = new System.Windows.Forms.Label();
            this.functionNameField = new System.Windows.Forms.TextBox();
            this.label3 = new System.Windows.Forms.Label();
            this.createPropertyContextMenu = new System.Windows.Forms.ContextMenuStrip(this.components);
            this.Range = new System.Windows.Forms.ToolStripMenuItem();
            this.Toggle = new System.Windows.Forms.ToolStripMenuItem();
            this.Color = new System.Windows.Forms.ToolStripMenuItem();
            this.propertyTypeLabel = new System.Windows.Forms.Label();
            this.button4 = new System.Windows.Forms.Button();
            this.colorPicker = new System.Windows.Forms.ColorDialog();
            ((System.ComponentModel.ISupportInitialize)(this.splitContainer1)).BeginInit();
            this.splitContainer1.Panel1.SuspendLayout();
            this.splitContainer1.Panel2.SuspendLayout();
            this.splitContainer1.SuspendLayout();
            this.panel1.SuspendLayout();
            this.panel2.SuspendLayout();
            this.exampleTabs.SuspendLayout();
            this.createPropertyContextMenu.SuspendLayout();
            this.SuspendLayout();
            // 
            // splitContainer1
            // 
            this.splitContainer1.Dock = System.Windows.Forms.DockStyle.Fill;
            this.splitContainer1.Location = new System.Drawing.Point(0, 0);
            this.splitContainer1.Name = "splitContainer1";
            // 
            // splitContainer1.Panel1
            // 
            this.splitContainer1.Panel1.Controls.Add(this.button1);
            this.splitContainer1.Panel1.Controls.Add(this.fileList);
            // 
            // splitContainer1.Panel2
            // 
            this.splitContainer1.Panel2.Controls.Add(this.panel1);
            this.splitContainer1.Size = new System.Drawing.Size(1055, 686);
            this.splitContainer1.SplitterDistance = 349;
            this.splitContainer1.TabIndex = 0;
            // 
            // button1
            // 
            this.button1.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Bottom | System.Windows.Forms.AnchorStyles.Right)));
            this.button1.Location = new System.Drawing.Point(252, 656);
            this.button1.Name = "button1";
            this.button1.Size = new System.Drawing.Size(91, 23);
            this.button1.TabIndex = 1;
            this.button1.Text = "New function";
            this.button1.UseVisualStyleBackColor = true;
            this.button1.Click += new System.EventHandler(this.NewFunction);
            // 
            // fileList
            // 
            this.fileList.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.fileList.FormattingEnabled = true;
            this.fileList.Location = new System.Drawing.Point(3, 3);
            this.fileList.Name = "fileList";
            this.fileList.Size = new System.Drawing.Size(343, 680);
            this.fileList.TabIndex = 0;
            this.fileList.SelectedIndexChanged += new System.EventHandler(this.OnSelectFile);
            // 
            // panel1
            // 
            this.panel1.AutoSize = true;
            this.panel1.AutoSizeMode = System.Windows.Forms.AutoSizeMode.GrowAndShrink;
            this.panel1.Controls.Add(this.newExampleBtn);
            this.panel1.Controls.Add(this.deleteExampleBtn);
            this.panel1.Controls.Add(this.moveLeftBtn);
            this.panel1.Controls.Add(this.revertBtn);
            this.panel1.Controls.Add(this.moveRightBtn);
            this.panel1.Controls.Add(this.saveBtn);
            this.panel1.Controls.Add(this.label1);
            this.panel1.Controls.Add(this.functionTagsField);
            this.panel1.Controls.Add(this.panel2);
            this.panel1.Controls.Add(this.exampleTabs);
            this.panel1.Controls.Add(this.fileTitle);
            this.panel1.Controls.Add(this.functionDescriptionField);
            this.panel1.Controls.Add(this.label2);
            this.panel1.Controls.Add(this.functionNameField);
            this.panel1.Controls.Add(this.label3);
            this.panel1.Dock = System.Windows.Forms.DockStyle.Fill;
            this.panel1.Location = new System.Drawing.Point(0, 0);
            this.panel1.Margin = new System.Windows.Forms.Padding(3, 3, 0, 3);
            this.panel1.Name = "panel1";
            this.panel1.Size = new System.Drawing.Size(702, 686);
            this.panel1.TabIndex = 5;
            // 
            // newExampleBtn
            // 
            this.newExampleBtn.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Right)));
            this.newExampleBtn.Font = new System.Drawing.Font("Microsoft Sans Serif", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.newExampleBtn.Location = new System.Drawing.Point(622, 180);
            this.newExampleBtn.Name = "newExampleBtn";
            this.newExampleBtn.RightToLeft = System.Windows.Forms.RightToLeft.Yes;
            this.newExampleBtn.Size = new System.Drawing.Size(67, 23);
            this.newExampleBtn.TabIndex = 15;
            this.newExampleBtn.Text = "New";
            this.newExampleBtn.UseVisualStyleBackColor = true;
            this.newExampleBtn.Click += new System.EventHandler(this.AddExample);
            // 
            // deleteExampleBtn
            // 
            this.deleteExampleBtn.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Right)));
            this.deleteExampleBtn.Font = new System.Drawing.Font("Microsoft Sans Serif", 8.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.deleteExampleBtn.Location = new System.Drawing.Point(592, 180);
            this.deleteExampleBtn.Name = "deleteExampleBtn";
            this.deleteExampleBtn.RightToLeft = System.Windows.Forms.RightToLeft.Yes;
            this.deleteExampleBtn.Size = new System.Drawing.Size(25, 23);
            this.deleteExampleBtn.TabIndex = 14;
            this.deleteExampleBtn.Text = "X";
            this.deleteExampleBtn.UseVisualStyleBackColor = true;
            this.deleteExampleBtn.Click += new System.EventHandler(this.DeleteExample);
            // 
            // moveLeftBtn
            // 
            this.moveLeftBtn.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Right)));
            this.moveLeftBtn.Font = new System.Drawing.Font("Microsoft Sans Serif", 8.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.moveLeftBtn.Location = new System.Drawing.Point(531, 180);
            this.moveLeftBtn.Name = "moveLeftBtn";
            this.moveLeftBtn.Size = new System.Drawing.Size(25, 23);
            this.moveLeftBtn.TabIndex = 12;
            this.moveLeftBtn.Text = "<";
            this.moveLeftBtn.UseVisualStyleBackColor = true;
            this.moveLeftBtn.Click += new System.EventHandler(this.MoveExampleToLeft);
            // 
            // revertBtn
            // 
            this.revertBtn.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Right)));
            this.revertBtn.Location = new System.Drawing.Point(531, 12);
            this.revertBtn.Name = "revertBtn";
            this.revertBtn.Size = new System.Drawing.Size(75, 23);
            this.revertBtn.TabIndex = 11;
            this.revertBtn.Text = "Revert";
            this.revertBtn.UseVisualStyleBackColor = true;
            this.revertBtn.Click += new System.EventHandler(this.Revert);
            // 
            // moveRightBtn
            // 
            this.moveRightBtn.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Right)));
            this.moveRightBtn.Font = new System.Drawing.Font("Microsoft Sans Serif", 8.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.moveRightBtn.Location = new System.Drawing.Point(562, 180);
            this.moveRightBtn.Name = "moveRightBtn";
            this.moveRightBtn.Size = new System.Drawing.Size(25, 23);
            this.moveRightBtn.TabIndex = 13;
            this.moveRightBtn.Text = ">";
            this.moveRightBtn.UseVisualStyleBackColor = true;
            this.moveRightBtn.Click += new System.EventHandler(this.MoveExampleToRight);
            // 
            // saveBtn
            // 
            this.saveBtn.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Right)));
            this.saveBtn.Location = new System.Drawing.Point(612, 12);
            this.saveBtn.Name = "saveBtn";
            this.saveBtn.Size = new System.Drawing.Size(75, 23);
            this.saveBtn.TabIndex = 10;
            this.saveBtn.Text = "Save";
            this.saveBtn.UseVisualStyleBackColor = true;
            this.saveBtn.Click += new System.EventHandler(this.Save);
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(10, 72);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(31, 13);
            this.label1.TabIndex = 9;
            this.label1.Text = "Tags";
            // 
            // functionTagsField
            // 
            this.functionTagsField.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.functionTagsField.Location = new System.Drawing.Point(85, 69);
            this.functionTagsField.Name = "functionTagsField";
            this.functionTagsField.Size = new System.Drawing.Size(602, 20);
            this.functionTagsField.TabIndex = 8;
            this.functionTagsField.Text = "Function tags";
            // 
            // panel2
            // 
            this.panel2.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.panel2.BorderStyle = System.Windows.Forms.BorderStyle.Fixed3D;
            this.panel2.Controls.Add(this.button4);
            this.panel2.Controls.Add(this.propertyTypeLabel);
            this.panel2.Controls.Add(this.propertyMaxField);
            this.panel2.Controls.Add(this.propertyMinField);
            this.panel2.Controls.Add(this.propertyValueField);
            this.panel2.Controls.Add(this.propertyShaderNameField);
            this.panel2.Controls.Add(this.propertyNameField);
            this.panel2.Controls.Add(this.label13);
            this.panel2.Controls.Add(this.label12);
            this.panel2.Controls.Add(this.label11);
            this.panel2.Controls.Add(this.label10);
            this.panel2.Controls.Add(this.label9);
            this.panel2.Controls.Add(this.button3);
            this.panel2.Controls.Add(this.button2);
            this.panel2.Controls.Add(this.moveUpProperty);
            this.panel2.Controls.Add(this.propertyList);
            this.panel2.Controls.Add(this.createPropertyBtn);
            this.panel2.Controls.Add(this.label8);
            this.panel2.Controls.Add(this.exampleShaderField);
            this.panel2.Controls.Add(this.label7);
            this.panel2.Controls.Add(this.exampleCodeField);
            this.panel2.Controls.Add(this.label6);
            this.panel2.Controls.Add(this.label4);
            this.panel2.Controls.Add(this.exampleDescriptionField);
            this.panel2.Controls.Add(this.exampleNameField);
            this.panel2.Controls.Add(this.label5);
            this.panel2.Location = new System.Drawing.Point(3, 191);
            this.panel2.Name = "panel2";
            this.panel2.Size = new System.Drawing.Size(687, 488);
            this.panel2.TabIndex = 7;
            // 
            // propertyMaxField
            // 
            this.propertyMaxField.Location = new System.Drawing.Point(606, 446);
            this.propertyMaxField.Name = "propertyMaxField";
            this.propertyMaxField.Size = new System.Drawing.Size(62, 20);
            this.propertyMaxField.TabIndex = 26;
            this.propertyMaxField.TextChanged += new System.EventHandler(this.OnPropertyChanged);
            // 
            // propertyMinField
            // 
            this.propertyMinField.Location = new System.Drawing.Point(506, 446);
            this.propertyMinField.Name = "propertyMinField";
            this.propertyMinField.Size = new System.Drawing.Size(62, 20);
            this.propertyMinField.TabIndex = 25;
            this.propertyMinField.TextChanged += new System.EventHandler(this.OnPropertyChanged);
            // 
            // propertyValueField
            // 
            this.propertyValueField.Location = new System.Drawing.Point(359, 446);
            this.propertyValueField.Name = "propertyValueField";
            this.propertyValueField.Size = new System.Drawing.Size(111, 20);
            this.propertyValueField.TabIndex = 24;
            this.propertyValueField.TextChanged += new System.EventHandler(this.OnPropertyChanged);
            // 
            // propertyShaderNameField
            // 
            this.propertyShaderNameField.Location = new System.Drawing.Point(397, 417);
            this.propertyShaderNameField.Name = "propertyShaderNameField";
            this.propertyShaderNameField.Size = new System.Drawing.Size(271, 20);
            this.propertyShaderNameField.TabIndex = 23;
            this.propertyShaderNameField.TextChanged += new System.EventHandler(this.OnPropertyChanged);
            // 
            // propertyNameField
            // 
            this.propertyNameField.Location = new System.Drawing.Point(397, 388);
            this.propertyNameField.Name = "propertyNameField";
            this.propertyNameField.Size = new System.Drawing.Size(271, 20);
            this.propertyNameField.TabIndex = 22;
            this.propertyNameField.TextChanged += new System.EventHandler(this.OnPropertyChanged);
            // 
            // label13
            // 
            this.label13.AutoSize = true;
            this.label13.Location = new System.Drawing.Point(574, 449);
            this.label13.Name = "label13";
            this.label13.Size = new System.Drawing.Size(27, 13);
            this.label13.TabIndex = 21;
            this.label13.Text = "Max";
            // 
            // label12
            // 
            this.label12.AutoSize = true;
            this.label12.Location = new System.Drawing.Point(476, 449);
            this.label12.Name = "label12";
            this.label12.Size = new System.Drawing.Size(24, 13);
            this.label12.TabIndex = 20;
            this.label12.Text = "Min";
            // 
            // label11
            // 
            this.label11.AutoSize = true;
            this.label11.Location = new System.Drawing.Point(319, 449);
            this.label11.Name = "label11";
            this.label11.Size = new System.Drawing.Size(34, 13);
            this.label11.TabIndex = 19;
            this.label11.Text = "Value";
            // 
            // label10
            // 
            this.label10.AutoSize = true;
            this.label10.Location = new System.Drawing.Point(319, 420);
            this.label10.Name = "label10";
            this.label10.Size = new System.Drawing.Size(72, 13);
            this.label10.TabIndex = 18;
            this.label10.Text = "Shader Name";
            // 
            // label9
            // 
            this.label9.AutoSize = true;
            this.label9.Location = new System.Drawing.Point(319, 391);
            this.label9.Name = "label9";
            this.label9.Size = new System.Drawing.Size(72, 13);
            this.label9.TabIndex = 17;
            this.label9.Text = "Display Name";
            // 
            // button3
            // 
            this.button3.Location = new System.Drawing.Point(225, 449);
            this.button3.Name = "button3";
            this.button3.Size = new System.Drawing.Size(75, 23);
            this.button3.TabIndex = 16;
            this.button3.Text = "Remove";
            this.button3.UseVisualStyleBackColor = true;
            this.button3.Click += new System.EventHandler(this.RemoveProperty);
            // 
            // button2
            // 
            this.button2.Location = new System.Drawing.Point(225, 420);
            this.button2.Name = "button2";
            this.button2.Size = new System.Drawing.Size(75, 23);
            this.button2.TabIndex = 15;
            this.button2.Text = "Move Down";
            this.button2.UseVisualStyleBackColor = true;
            this.button2.Click += new System.EventHandler(this.MoveDownProperty);
            // 
            // moveUpProperty
            // 
            this.moveUpProperty.Location = new System.Drawing.Point(225, 391);
            this.moveUpProperty.Name = "moveUpProperty";
            this.moveUpProperty.Size = new System.Drawing.Size(75, 23);
            this.moveUpProperty.TabIndex = 14;
            this.moveUpProperty.Text = "Move Up";
            this.moveUpProperty.UseVisualStyleBackColor = true;
            this.moveUpProperty.Click += new System.EventHandler(this.MoveUpProperty);
            // 
            // propertyList
            // 
            this.propertyList.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left)));
            this.propertyList.FormattingEnabled = true;
            this.propertyList.Location = new System.Drawing.Point(75, 362);
            this.propertyList.Name = "propertyList";
            this.propertyList.Size = new System.Drawing.Size(144, 108);
            this.propertyList.TabIndex = 13;
            this.propertyList.SelectedValueChanged += new System.EventHandler(this.SelectProperty);
            // 
            // createPropertyBtn
            // 
            this.createPropertyBtn.Location = new System.Drawing.Point(225, 362);
            this.createPropertyBtn.Name = "createPropertyBtn";
            this.createPropertyBtn.Size = new System.Drawing.Size(75, 23);
            this.createPropertyBtn.TabIndex = 12;
            this.createPropertyBtn.Text = "Create";
            this.createPropertyBtn.UseVisualStyleBackColor = true;
            this.createPropertyBtn.Click += new System.EventHandler(this.CreateProperty);
            // 
            // label8
            // 
            this.label8.AutoSize = true;
            this.label8.Location = new System.Drawing.Point(5, 362);
            this.label8.Name = "label8";
            this.label8.Size = new System.Drawing.Size(54, 13);
            this.label8.TabIndex = 10;
            this.label8.Text = "Properties";
            // 
            // exampleShaderField
            // 
            this.exampleShaderField.AcceptsReturn = true;
            this.exampleShaderField.AcceptsTab = true;
            this.exampleShaderField.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.exampleShaderField.Location = new System.Drawing.Point(75, 246);
            this.exampleShaderField.Multiline = true;
            this.exampleShaderField.Name = "exampleShaderField";
            this.exampleShaderField.ScrollBars = System.Windows.Forms.ScrollBars.Vertical;
            this.exampleShaderField.Size = new System.Drawing.Size(593, 93);
            this.exampleShaderField.TabIndex = 9;
            this.exampleShaderField.Text = "Example shader";
            this.exampleShaderField.TextChanged += new System.EventHandler(this.OnChangeFunctionShader);
            // 
            // label7
            // 
            this.label7.AutoSize = true;
            this.label7.Location = new System.Drawing.Point(5, 246);
            this.label7.Name = "label7";
            this.label7.Size = new System.Drawing.Size(41, 13);
            this.label7.TabIndex = 8;
            this.label7.Text = "Shader";
            // 
            // exampleCodeField
            // 
            this.exampleCodeField.AcceptsReturn = true;
            this.exampleCodeField.AcceptsTab = true;
            this.exampleCodeField.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.exampleCodeField.Location = new System.Drawing.Point(75, 134);
            this.exampleCodeField.Multiline = true;
            this.exampleCodeField.Name = "exampleCodeField";
            this.exampleCodeField.ScrollBars = System.Windows.Forms.ScrollBars.Vertical;
            this.exampleCodeField.Size = new System.Drawing.Size(593, 96);
            this.exampleCodeField.TabIndex = 7;
            this.exampleCodeField.Text = "Example code";
            this.exampleCodeField.TextChanged += new System.EventHandler(this.OnChangeFunctionCode);
            // 
            // label6
            // 
            this.label6.AutoSize = true;
            this.label6.Location = new System.Drawing.Point(5, 137);
            this.label6.Name = "label6";
            this.label6.Size = new System.Drawing.Size(32, 13);
            this.label6.TabIndex = 6;
            this.label6.Text = "Code";
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.label4.Location = new System.Drawing.Point(5, 8);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(35, 13);
            this.label4.TabIndex = 0;
            this.label4.Text = "Name";
            // 
            // exampleDescriptionField
            // 
            this.exampleDescriptionField.AcceptsReturn = true;
            this.exampleDescriptionField.AcceptsTab = true;
            this.exampleDescriptionField.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.exampleDescriptionField.Location = new System.Drawing.Point(75, 41);
            this.exampleDescriptionField.Multiline = true;
            this.exampleDescriptionField.Name = "exampleDescriptionField";
            this.exampleDescriptionField.ScrollBars = System.Windows.Forms.ScrollBars.Vertical;
            this.exampleDescriptionField.Size = new System.Drawing.Size(593, 78);
            this.exampleDescriptionField.TabIndex = 5;
            this.exampleDescriptionField.Text = "Example description";
            this.exampleDescriptionField.TextChanged += new System.EventHandler(this.OnChangeExampleDescription);
            // 
            // exampleNameField
            // 
            this.exampleNameField.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.exampleNameField.Location = new System.Drawing.Point(75, 5);
            this.exampleNameField.Name = "exampleNameField";
            this.exampleNameField.Size = new System.Drawing.Size(219, 20);
            this.exampleNameField.TabIndex = 1;
            this.exampleNameField.Text = "Example name";
            this.exampleNameField.TextChanged += new System.EventHandler(this.OnChangeExampleName);
            // 
            // label5
            // 
            this.label5.AutoSize = true;
            this.label5.Location = new System.Drawing.Point(5, 44);
            this.label5.Name = "label5";
            this.label5.Size = new System.Drawing.Size(60, 13);
            this.label5.TabIndex = 2;
            this.label5.Text = "Description";
            // 
            // exampleTabs
            // 
            this.exampleTabs.Controls.Add(this.tabPage2);
            this.exampleTabs.Location = new System.Drawing.Point(3, 173);
            this.exampleTabs.Multiline = true;
            this.exampleTabs.Name = "exampleTabs";
            this.exampleTabs.SelectedIndex = 0;
            this.exampleTabs.Size = new System.Drawing.Size(524, 20);
            this.exampleTabs.TabIndex = 6;
            this.exampleTabs.SelectedIndexChanged += new System.EventHandler(this.OnSelectTab);
            // 
            // tabPage2
            // 
            this.tabPage2.Location = new System.Drawing.Point(4, 22);
            this.tabPage2.Name = "tabPage2";
            this.tabPage2.Padding = new System.Windows.Forms.Padding(3);
            this.tabPage2.Size = new System.Drawing.Size(516, 0);
            this.tabPage2.TabIndex = 1;
            this.tabPage2.Text = "tabPage2";
            this.tabPage2.UseVisualStyleBackColor = true;
            // 
            // fileTitle
            // 
            this.fileTitle.AutoSize = true;
            this.fileTitle.Font = new System.Drawing.Font("Microsoft Sans Serif", 12F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.fileTitle.Location = new System.Drawing.Point(3, 6);
            this.fileTitle.Name = "fileTitle";
            this.fileTitle.Size = new System.Drawing.Size(77, 20);
            this.fileTitle.TabIndex = 0;
            this.fileTitle.Text = "filename";
            // 
            // functionDescriptionField
            // 
            this.functionDescriptionField.AcceptsReturn = true;
            this.functionDescriptionField.AcceptsTab = true;
            this.functionDescriptionField.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.functionDescriptionField.Location = new System.Drawing.Point(85, 95);
            this.functionDescriptionField.Multiline = true;
            this.functionDescriptionField.Name = "functionDescriptionField";
            this.functionDescriptionField.ScrollBars = System.Windows.Forms.ScrollBars.Vertical;
            this.functionDescriptionField.Size = new System.Drawing.Size(602, 73);
            this.functionDescriptionField.TabIndex = 4;
            this.functionDescriptionField.Text = "Function description";
            this.functionDescriptionField.TextChanged += new System.EventHandler(this.OnChangeFunctionDescription);
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(10, 45);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(35, 13);
            this.label2.TabIndex = 2;
            this.label2.Text = "Name";
            // 
            // functionNameField
            // 
            this.functionNameField.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.functionNameField.Location = new System.Drawing.Point(85, 45);
            this.functionNameField.Name = "functionNameField";
            this.functionNameField.Size = new System.Drawing.Size(602, 20);
            this.functionNameField.TabIndex = 1;
            this.functionNameField.Text = "Function name";
            this.functionNameField.TextChanged += new System.EventHandler(this.OnChangeFunctionName);
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Location = new System.Drawing.Point(10, 98);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(60, 13);
            this.label3.TabIndex = 3;
            this.label3.Text = "Description";
            // 
            // createPropertyContextMenu
            // 
            this.createPropertyContextMenu.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.Range,
            this.Toggle,
            this.Color});
            this.createPropertyContextMenu.Name = "contextMenuStrip1";
            this.createPropertyContextMenu.Size = new System.Drawing.Size(110, 70);
            this.createPropertyContextMenu.ItemClicked += new System.Windows.Forms.ToolStripItemClickedEventHandler(this.OnCreateProperty);
            // 
            // Range
            // 
            this.Range.Name = "Range";
            this.Range.Size = new System.Drawing.Size(109, 22);
            this.Range.Text = "Range";
            // 
            // Toggle
            // 
            this.Toggle.Name = "Toggle";
            this.Toggle.Size = new System.Drawing.Size(109, 22);
            this.Toggle.Text = "Toggle";
            // 
            // Color
            // 
            this.Color.Name = "Color";
            this.Color.Size = new System.Drawing.Size(109, 22);
            this.Color.Text = "Color";
            // 
            // propertyTypeLabel
            // 
            this.propertyTypeLabel.AutoSize = true;
            this.propertyTypeLabel.Location = new System.Drawing.Point(319, 362);
            this.propertyTypeLabel.Name = "propertyTypeLabel";
            this.propertyTypeLabel.Size = new System.Drawing.Size(69, 13);
            this.propertyTypeLabel.TabIndex = 27;
            this.propertyTypeLabel.Text = "Property type";
            this.propertyTypeLabel.TextAlign = System.Drawing.ContentAlignment.MiddleLeft;
            // 
            // button4
            // 
            this.button4.Location = new System.Drawing.Point(359, 467);
            this.button4.Name = "button4";
            this.button4.Size = new System.Drawing.Size(75, 23);
            this.button4.TabIndex = 28;
            this.button4.Text = "Pick Color";
            this.button4.UseVisualStyleBackColor = true;
            this.button4.Visible = false;
            this.button4.Click += new System.EventHandler(this.button4_Click);
            // 
            // Form1
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(1055, 686);
            this.Controls.Add(this.splitContainer1);
            this.Name = "Form1";
            this.Text = "Form1";
            this.splitContainer1.Panel1.ResumeLayout(false);
            this.splitContainer1.Panel2.ResumeLayout(false);
            this.splitContainer1.Panel2.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.splitContainer1)).EndInit();
            this.splitContainer1.ResumeLayout(false);
            this.panel1.ResumeLayout(false);
            this.panel1.PerformLayout();
            this.panel2.ResumeLayout(false);
            this.panel2.PerformLayout();
            this.exampleTabs.ResumeLayout(false);
            this.createPropertyContextMenu.ResumeLayout(false);
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.SplitContainer splitContainer1;
        private System.Windows.Forms.ListBox fileList;
        private System.Windows.Forms.Label fileTitle;
        private System.Windows.Forms.TextBox functionDescriptionField;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.TextBox functionNameField;
        private System.Windows.Forms.Panel panel1;
        private System.Windows.Forms.TabControl exampleTabs;
        private System.Windows.Forms.TabPage tabPage2;
        private System.Windows.Forms.TextBox exampleDescriptionField;
        private System.Windows.Forms.Label label5;
        private System.Windows.Forms.TextBox exampleNameField;
        private System.Windows.Forms.Label label4;
        private System.Windows.Forms.Panel panel2;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.TextBox functionTagsField;
        private System.Windows.Forms.Button revertBtn;
        private System.Windows.Forms.Button saveBtn;
        private System.Windows.Forms.Label label6;
        private System.Windows.Forms.Label label8;
        private System.Windows.Forms.TextBox exampleShaderField;
        private System.Windows.Forms.Label label7;
        private System.Windows.Forms.TextBox exampleCodeField;
        private System.Windows.Forms.Button newExampleBtn;
        private System.Windows.Forms.Button deleteExampleBtn;
        private System.Windows.Forms.Button moveRightBtn;
        private System.Windows.Forms.Button moveLeftBtn;
        private System.Windows.Forms.Button button1;
        private System.Windows.Forms.ListBox propertyList;
        private System.Windows.Forms.Button createPropertyBtn;
        private System.Windows.Forms.ContextMenuStrip createPropertyContextMenu;
        private System.Windows.Forms.ToolStripMenuItem Range;
        private System.Windows.Forms.ToolStripMenuItem Toggle;
        private System.Windows.Forms.ToolStripMenuItem Color;
        private System.Windows.Forms.Label label10;
        private System.Windows.Forms.Label label9;
        private System.Windows.Forms.Button button3;
        private System.Windows.Forms.Button button2;
        private System.Windows.Forms.Button moveUpProperty;
        private System.Windows.Forms.TextBox propertyNameField;
        private System.Windows.Forms.Label label13;
        private System.Windows.Forms.Label label12;
        private System.Windows.Forms.Label label11;
        private System.Windows.Forms.TextBox propertyMaxField;
        private System.Windows.Forms.TextBox propertyMinField;
        private System.Windows.Forms.TextBox propertyValueField;
        private System.Windows.Forms.TextBox propertyShaderNameField;
        private System.Windows.Forms.Label propertyTypeLabel;
        private System.Windows.Forms.Button button4;
        private System.Windows.Forms.ColorDialog colorPicker;
    }
}

