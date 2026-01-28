Il est facilement possible d'ajouter vos propres algorithmes de masking. Pour se faire vous pouvez créer une class héritant de FloraMask et avec l'attribut FloraMaskAttribute

```csharp
[Serializable, FloraMask("Mask from position")]
public class PositionMask : FloraMask
{
	public override string defaultName => "Position";

	//Properties visibles in mask popup settings
	public Transform target;
	public float radius;
}
```

> [!NOTE]
> An alert of type 'note' using global style 'callout'.

> [!TIP]
> An alert of type 'tip' using global style 'callout'.

> [!WARNING]
> An alert of type 'warning' using global style 'callout'.

> [!IMPORTANT]
> An alert of type 'important' using global style 'callout'.

> [!ATTENTION]
> An alert of type 'attention' using global style 'callout'.

> [!NOTE|style:flat]
> An alert of type 'note' using alert specific style 'flat' which overrides global style 'callout'.

[//]: <> (#Class:FloraMask)