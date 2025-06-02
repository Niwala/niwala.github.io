

const maxSize = 250;
const minSize = 150;
const shrinkDistance = 300;

InitializeCircle();
SetCirclesize(maxSize);

function InitializeCircle()
{
    //Load circle border
    const circle = document.getElementById('circle');
    const img = new Image();
    img.alt = 'Circle Image';

    //Load local image (from same directory, or use path if nested)
    img.src = 'main/media/logo-border-sword.png';

     //Append image once loaded
     img.onload = () => {
        circle.appendChild(img);
      };

    //Add scroll callback
    window.addEventListener('scroll', () => 
    {
        //Scroll value
        const scrollY = window.scrollY;
    
        //Clamp value between 0 and shrinkDistance
        const t = Math.min(scrollY, shrinkDistance);
    
        //Lerp size
        const size = maxSize - ((maxSize - minSize) * (t / shrinkDistance));
    
        //Apply size
        SetCirclesize(size);

        if (scrollY > minSize)
        {
            circle.style.top = (minSize-scrollY + 50.0) + 'px';
        }
    });
}


function SetCirclesize(size)
{
    circle.style.width = size + 'px';
    circle.style.height = size + 'px';
}