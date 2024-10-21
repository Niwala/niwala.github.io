async function fetchNotionData() 
{
	try 
	{
		const response = await fetch('https://sams-backend.vercel.app/api/fetch-notion');
		
		if (!response.ok) 
		{
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		
		const data = await response.json();
		console.log(data);  // Affiche ou utilise les données reçues
		
	} 
	catch (error) 
	{
		console.error('Error fetching data:', error);
	}
}

fetchNotionData();
