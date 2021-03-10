const fetchTasks = async (sessionToken) => {
    let response = await fetch('http://192.168.0.101:8000/tasks', {
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