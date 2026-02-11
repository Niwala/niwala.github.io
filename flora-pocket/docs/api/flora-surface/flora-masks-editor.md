# Flora Mask Editor

Un [Flora mask](api\generation\flora-mask.md) à 2 zones où afficher ses propriétés
### La popup de la liste de la Flora Surface
Pour modifier cette popup vous devez hériter de la classe ContextPopupEditor avec un attribut ContextPopupEditorAttribute.

```csharp
    [ContextPopupEditor(typeof(MyCustomMask))]
    public class MyCustomMaskEditor : ContextPopupEditor
    {
        public override string GetTitle(SerializedProperty property)
        {
	        //Use property.FindPropertyRelative("name").stringValue to get the mask name
            return "My custom mask";
        }

        public override void OnCreatePopupContent(SerializedProperty property, VisualElement content)
        {
            //...
        }
    }
```

