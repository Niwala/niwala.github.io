
function UrlOfImage(property)
{
   return property.external.url;
}

function ValueFromRichText(property)
{
   if (property.rich_text.length == 0)
      return "";
   return property.rich_text[0].plain_text;
}

function ValueFromTitle(property)
{
   if (property.title.length == 0)
      return "";
   return property.title[0].plain_text;
}

function ValueFromCheckbox(property)
{
   return property.checkbox;
}

function ValueFromPageID(property)
{
   return property.page_id;
}


class FunctionPreview
{
   constructor(json)
   {
      this.id = json.id;
      this.description = ValueFromRichText(json.properties.Description);
      this.name = ValueFromTitle(json.properties.Name);
      this.niceName = ValueFromRichText(json.properties.NiceName);
      this.preview = ValueFromRichText(json.properties.Preview);
      this.tags = ValueFromRichText(json.properties.Tags);
      this.public = ValueFromCheckbox(json.properties.Public);
   }
}

class PageContent 
{
    constructor(json, fetchChildrenCallback, onPageUpdate)
    {
      this.json = json; // Original JSON from Notion API      
      this.html = ""; // Full HTML of the page
      this.examples = []; // List of example blocks
      this.links = []; // List of link blocks
      this.children = []; // Child blocks
      this.onPageUpdate = onPageUpdate;

      for (let i = 0; i < json.results.length; i++) 
      {
         let notionBlock = new NotionBlock(json.results[i], fetchChildrenCallback, this.UpdatePageHtml.bind(this), this.ManageSpecialCase.bind(this));
         this.children.push(notionBlock);
         this.html += notionBlock.html;
      }
    }

    // Updates the HTML of the page
    UpdatePageHtml() 
    {
         this.html = "";
         for (let i = 0; i < this.children.length; i++) 
         {
            this.html += this.children[i].html;
         }
         this.onPageUpdate(this.html);
    }

    ManageSpecialCase(type, container)
    {
      switch(type)
      {
         case "Examples": this.LoadExamples(container); break;

         case "Links":
            {
               console.log("Links : " + container.children.length);
               for (let i = 0; i < container.children.length; i++) 
               {
                  console.log(container.children[i].json);
               }
            }
            break;
      }
   }

   async LoadExamples(container)
   {
      for (let i = 0; i < container.children.length; i++) 
      {
         if (container.children[i].json.type != "child_page")
            continue;

         const exampleJson = await FetchNotionBlock(container.children[i].json.id);
         this.examples.push(new NotionExample(exampleJson));
      }
   }
}

class NotionBlock
{
   constructor(json, fetchChildrenCallback, notifyHtmlUpdate, specialCallback)
   {
      this.json = json; // Original JSON from Notion API
      this.children = []; // Child blocks
      this.fetchChildrenCallback = fetchChildrenCallback; // Function to fetch child blocks
      this.notifyHtmlUpdate = notifyHtmlUpdate; // Callback to notify partial/full HTML updates
      this.specialCallback = specialCallback;

      this.prefix = "";
      this.postfix = "";
      this.html = "";
      this.hide = false;

      // Generate prefix and postfix
      this.GeneratePrePost();
      this.UpdateHtml();

      if (!this.ShouldIgnoreChildren())
      {
         if (this.IsSpecialCase())
         {
            specialCallback(this.GetSpecialCaseType(), null);
         }
         else if (this.json.has_children)
         {
            this.FetchChildren();
         }
      }
   }

   UpdateHtml()
   {
      if (this.hide)
      {
         this.html = "";
      }
      else
      {
         this.html = this.prefix + this.children.map(child => child.html).join("") + this.postfix;
      }

      if (this.notifyHtmlUpdate != null)
      {
         this.notifyHtmlUpdate();
      }
   }

   ShouldIgnoreChildren() 
   {
      return (this.json.type == "child_page" || this.json.type == "child_database" || this.json.type == "unsupported");
   }

   IsSpecialCase()
   {
      if (this.json.type == "heading_3" && this.json.heading_3.color == "default")
      {
         let text = this.GetSpecialCaseType();
         if (text == "Examples" || text == "Links")
         {
            return true;
         }
      }

      return false;
   }

   GetSpecialCaseType()
   {
      return this.json.heading_3.rich_text?.[0]?.plain_text;
   }

   // Fetches children for the current block recursively
   async FetchChildren() 
   {
      const childList = await this.fetchChildrenCallback(this.json.id); // Get children from API
      let htmlChanged = false;
      let specialContainerType = null;

      for (let i = 0; i < childList.results.length; i++) 
      {
         const element = childList.results[i];
         let childNotionBlock = new NotionBlock(element, this.fetchChildrenCallback, null, (type) => {specialContainerType = type});
         this.children.push(childNotionBlock);
         htmlChanged |= (childNotionBlock.html != "");
         childNotionBlock.notifyHtmlUpdate = this.UpdateHtml.bind(this);

         this.childrenHtml += childNotionBlock.html;
      }

      if (specialContainerType != null)
      {
         this.hide = true;
         this.specialCallback(specialContainerType, this)
      }
      else if (htmlChanged)
      {
         this.UpdateHtml();
      }
   }

   GeneratePrePost()
   {
      switch(this.json.type)
      {
         case "heading_1": this.prefix = "<div class='heading_1'>" + this.HtmlFromRichText(this.json.heading_1); this.postfix = "</div>"; break;
         case "heading_2": this.prefix = "<div class='heading_2'>" + this.HtmlFromRichText(this.json.heading_2); this.postfix = "</div>"; break;
         case "heading_3": this.prefix = "<div class='heading_3'>" + this.HtmlFromRichText(this.json.heading_3); this.postfix = "</div>"; break;
         case "paragraph": this.prefix = "<p>" + this.HtmlFromRichText(this.json.paragraph); this.postfix = "</p>"; break;
         case "code": this.prefix = "<div class='notion-code-container'><pre class='line-numbers'><code class='language-hlsl'>" + this.HtmlFromRichText(this.json.code); this.postfix = "</code></pre></div>"; break;
         case "callout": this.prefix = "<div class='callout'><div class='callout-icon'></div><div class='callout-content'>"; this.postfix = "</div></div>"; break;
         case "bulleted_list_item": this.prefix = "<ul><li>" + this.HtmlFromRichText(this.json.bulleted_list_item); this.postfix = "</li></ul>"; break;
         case "numbered_list_item": this.prefix = "<ol><li>" + this.HtmlFromRichText(this.json.numbered_list_item); this.postfix = "</li></ol>"; break;
         case "divider": this.prefix = "<div class='divider'>"; this.postfix = "</div>"; break;
         case "toggle": this.prefix = "<div>toggle"; this.postfix = "</div>"; break;
         case "quote": this.prefix = "<blockquote class='notion-quote'>" + this.HtmlFromRichText(this.json.quote); this.postfix = "</blockquote>"; break;
         case "link_to_page": this.prefix = "<a href='" + ValueFromPageID(this.json.link_to_page); this.postfix = "'>link_to_page</a>"; break;
         case "image": this.prefix = "<img class='notion-image' src='" + UrlOfImage(this.json.image); this.postfix = "'>"; break;
         
         case "column_list": this.prefix = "<div class='notion-columns'>"; this.postfix = "</div>"; break;
         case "block": this.prefix = "<div class='notion-bloc'>"; this.postfix = "</div>"; break;
         case "column": this.prefix = "<div class='notion-column'>"; this.postfix = "</div>"; break;


         //Unsupported
         case "unsupported": break;

         default: this.prefix = "<p>Unknown type : " + this.json.type; this.postfix = "</p>"
      }
   }

   HtmlFromRichText(property)
   {
      let html = "";
      for (let i = 0; i < property.rich_text.length; i++) 
      {
         const element = property.rich_text[i];
         if (element.href == null)
         {
            html += element.plain_text;
         }
         else
         {
            html += "<a href='" + element.href + "'>" + element.plain_text + "</a>";
         }
      }

      return html;
   }
}

class NotionExample
{

   constructor(json)
   {
      console.log("Example-----------");
      console.log(json);
      this.json = json;
      this.code = "";
      this.hasTable = false;
      this.hasCode = false;
      this.fields = [];

      for (var i = 0; i < json.results.length; i++) 
      {
         if (!this.hasTable && json.results[i].type == "table")
         {
            this.hasTable = true;
            this.ReadPropertiesTable(json.results[i].id);
         }
         else if (!this.hasCode && json.results[i].type == "code")
         {
            this.hasCode = true;
            this.ReadCode(json.results[i]);
         }
      }
   }

   async ReadPropertiesTable(tableID)
   {
      const tableJson = await FetchNotionBlock(tableID);
      console.log(tableJson); 

      for (var i = 0; i < tableJson.results.length; i++) //Ignore the first row (labels)
      {
         let row = tableJson.results[i].table_row;
         switch (row.cells[0]?.[0]?.plain_text)
         {
            case "Toggle": this.fields.push(new ToggleField(row.cells[1]?.[0]?.plain_text, row.cells[2]?.[0]?.plain_text)); break;
            case "Float": this.fields.push(new FloatField(row.cells[1]?.[0]?.plain_text, row.cells[2]?.[0]?.plain_text)); break;
            case "Slider": this.fields.push(new SliderField(row.cells[1]?.[0]?.plain_text, row.cells[2]?.[0]?.plain_text, row.cells[3]?.[0]?.plain_text, row.cells[4]?.[0]?.plain_text)); break;
            case "Color": this.fields.push(new ColorField(row.cells[1]?.[0]?.plain_text, row.cells[2]?.[0]?.plain_text)); break;
         }
      }

      for (var i = 0; i < this.fields.length; i++) 
      {
         console.log(this.fields[i]);
      }
   }

   async ReadCode(container)
   {
      this.code = container.code.rich_text[0].plain_text;
   }
}