
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