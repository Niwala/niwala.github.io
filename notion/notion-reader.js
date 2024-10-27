async function fetchNotionData() 
{
	try 
	{
		const response = await fetch('https://backendfinalfinalv3.vercel.app/api');
		
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
