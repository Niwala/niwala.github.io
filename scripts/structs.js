
class FunctionPreview
{

   constructor(json)
   {
      this.id = json.id;
      this.description = this.ValueFromRichText(json.properties.Description);


   }

   ValueFromRichText(property)
   {
      if (property.rich_text.length == 0)
         return "";
      return property.rich_text[0].plain_text;
   }


}