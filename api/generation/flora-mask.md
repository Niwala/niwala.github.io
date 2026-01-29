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

