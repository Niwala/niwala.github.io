
class FunctionPreview
{
   constructor(json)
   {
      this.id = json.id;
      this.description = this.ValueFromRichText(json.properties.Description);
      this.name = this.ValueFromTitle(json.properties.Name);
      this.niceName = this.ValueFromRichText(json.properties.NiceName);
      this.preview = this.ValueFromRichText(json.properties.Preview);
      this.tags = this.ValueFromRichText(json.properties.Tags);
      this.public = this.ValueFromCheckbox(json.properties.Public);
   }

   ValueFromRichText(property)
   {
      if (property.rich_text.length == 0)
         return "";
      return property.rich_text[0].plain_text;
   }

   ValueFromTitle(property)
   {
      if (property.title.length == 0)
         return "";
      return property.title[0].plain_text;
   }

   ValueFromCheckbox(property)
   {
      return property.checkbox;
   }
}