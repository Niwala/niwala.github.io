
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

class NotionBlock
{
   constructor(json)
   {
      this.json = json;
      this.html = "";

      // Créons une promesse pour signaler quand le bloc est terminé
      this.promise = new Promise(async (resolve) => 
      {
         if (json.has_children) 
         {
               FetchNotionPage(json.id, async (childsData) => 
               {
                  await this.CompileChildsHtml(childsData, this.GenerateHtml.bind(this));
                  resolve(this.html);
               });
         }
         else 
         {
               this.GenerateHtml("");
               resolve(this.html); // Résout immédiatement si pas d'enfants
         }
      });
   }

   async CompileChildsHtml(childsData, callback)
   {
      let html = "";

      // Crée une liste de promesses pour chaque bloc Notion
      const blockPromises = childsData.results.map(result => 
      {
         console.log(result);
         const notionBlock = new NotionBlock(result);
         return notionBlock.promise; // Renvoie la promesse de chaque bloc
      });

      // Attends que toutes les promesses soient résolues
      const allHtmlBlocks = await Promise.all(blockPromises);

      // Concatène le HTML final
      html = allHtmlBlocks.join(""); 
      callback(html);
   }

   GenerateHtml(childsHtml)
   {
      let s = "";

      switch(this.json.type)
      {
         case "heading_1": s += "<div class='heading_1'>" + ValueFromRichText(this.json.heading_1) + "</div>"; break;
         case "heading_2": s +=  "<div class='heading_2'>" + ValueFromRichText(this.json.heading_2) + "</div>"; break;
         case "heading_3": s +=  "<div class='heading_3'>" + ValueFromRichText(this.json.heading_3) + "</div>"; break;
         case "paragraph": s +=  "<p>" + ValueFromRichText(this.json.paragraph) + "</div>"; break;
         case "code": s +=  "<div class='code-container'><pre class='line-numbers'><code class='language-hlsl'>" + ValueFromRichText(this.json.code) + "</code></pre></div>"; break;
         case "callout": s +=  "<div class='callout'>" + childsHtml + "</div>"; break;
         case "bulleted_list_item": s +=  "<ul><li>" + ValueFromRichText(this.json.bulleted_list_item) + "</li></ul>"; break;
         case "numbered_list_item": s +=  "<ol><li>" + ValueFromRichText(this.json.numbered_list_item) + "</li></ol>"; break;
         case "divider": s +=  "<div class='divider'></div>"; break;
         case "toggle": s +=  "</br>toggle"; break;
         case "quote": s +=  "<blockquote>" + ValueFromRichText(this.json.quote) + "</blockquote>"; break;
         case "link_to_page": s +=  "<a href='" + ValueFromPageID(this.json.link_to_page) + "'>link_to_page</a>"; break;
      }

      this.html = s;
   }
}