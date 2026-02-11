# Flora Masks
- Les données sont stockée par vertex.
- Peut être sous forme de float simple ou float4.
- Regénéré à chaque rebuild de la surface.

## Masques natifs
Il existe une série de masques pré faits :
- [Paintable Mask](api\flora-surface\flora-masks\flora-masks-paintable.md)
- [Ambient Occlusion Mask](api\flora-surface\flora-masks\flora-masks-ao.md)
- [Curvature Mask](api\flora-surface\flora-masks\flora-masks-curvature.md)
- [Light Mask](api\flora-surface\flora-masks\flora-masks-light.md)
- [Normal Mask](api\flora-surface\flora-masks\flora-masks-normal.md)
- [Orientation Mask](api\flora-surface\flora-masks\flora-masks-orientation.md)
- [Texture Mask](api\flora-surface\flora-masks\flora-masks-texture.md)
- [Vertex Color Mask](api\flora-surface\flora-masks\flora-masks-vertex-color.md)

## Masques custom
Il est aussi possible de réaliser son propre algorithme pour créer des masques custom. Pour créer votre propre masque, vous devez créer une classe héritant de FloraMask et ayant l'attribut FloraMaskAttribute.

```csharp
    [FloraMask("Uniform Color Mask", 0)]
    public class UniformColorMask : FloraMask
    {
        public override string defaultName => "Uniform";
		public override MaskRequirement requirements => MaskRequirement.None;

        public Color color;
        

        public override void Execute(NavigableSurface surface)
        {
			//WIP...
        }
    }
```

> DefaultName : Le nom avec lequel le masque sera créé par défaut. Notez que le nom du masque sert de référence et est destiné à être modifié par l'utilisateur.

> MaskRequirements : Permet d'indiquer que votre masque requière des données qui peuvent être précalculées. Ces données peuvent être utilisées par plusieurs mask.

<!--#Enum: MaskRequirement-->