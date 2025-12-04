import axios from 'axios';

//colocar seu ip nesta baseURL para o funcionamento da api e ligar o site laravel pelo php artisan serve
//ip Carlos: 192.168.15.104
//ip Fábio: 200.53.197.187
//ip Rapha: 192.168.0.137
//lembrem que o ip pode mudar ent caso nao funcione digite no cmd o seguinte comando ipconfig
const api = axios.create({
    baseURL: 'http://200.53.197.187:8000/api', 
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

export default api;