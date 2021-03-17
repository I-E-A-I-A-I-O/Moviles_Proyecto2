const fetchTasks = async (sessionToken) => {
    let response = await fetch('https://moviles-proyecto2.herokuapp.com/tasks', {
        method: 'GET',
        cache: 'no-cache',
        headers: {
            'authToken': sessionToken
        }
    }).catch(err => {
        console.log(err);
    });
    if (response){
        return await response.json();
    }
    else{
        return null;
    }
}

export { fetchTasks }