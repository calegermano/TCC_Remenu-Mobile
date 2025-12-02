import axios from 'axios';

//colocar seu ip nesta baseURL para o funcionamento da api e ligar o site laravel pelo php artisan serve
//ip Carlos: 192.168.15.104
//lembrem que o ip pode mudar ent caso nao funcione digite no cmd o seguinte comando curl https://api.ipify.org
const api = axios.create({
    baseURL: 'http://192.168.15.104:8000/api', 
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

export default api;