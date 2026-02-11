# Navigable Surface
Les surface navigable sont au cœur du fonctionnement de FloraPocket. Ces dernières ont deux rôles majeurs :
- Garantir une surface avec une géométrie propre, continue, régulière, standard.
- Permettre une évaluation très rapide de cette surface pour les différents processus de génération.

## Classe
<!--#Class: NavigableSurface-->

## Création
La manière la plus simple de créer une NavigableSurface est de la générer via le component FloraSurface. Vous pouvez néanmoins créer une surface depuis l'API dédié : 

IMeshProvider

SurfaceSettingsSnapshot


## Evaluation & Navigation

#### Surface point
La plupart des opérations se feront à l'aide de [Surface point](api\flora-surface\surface-point.md)


### Raycast
Raycast sur la surface, complètement indépendant de la physique d'Unity.

### Move

### GetTrianglesArround

### Scatter

### Convert to Mesh


## Chunks