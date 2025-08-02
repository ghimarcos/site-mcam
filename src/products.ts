// Define a "forma" (interface) que cada produto terá
export interface Product {
    id: number;
    code: string;
    name: string;
    category: string;
    image: string; // O caminho para a imagem do produto
}

// Nossa lista de produtos de exemplo
export const products: Product[] = [
    { id: 1, code: '3532', name: 'PLACA FECH. P/ JANELA', category: 'Metais 01', image: 'assets/batedeira-1.png' },
    { id: 2, code: '1401', name: 'PLACA FECH. CENTRAL S/ PUXADOR E 1503', category: 'Metais 01', image: 'assets/batedeira-1.png' },
    { id: 3, code: '3532', name: 'PLACA FECH. P/ JANELA', category: 'Metais 02', image: 'assets/batedeira-1.png' },
    { id: 4, code: '3230 / 1511AX', name: 'ESPELHO INJETADO REFORÇADO C/ APARADOR P/ 3530', category: 'Metais 02', image: 'assets/batedeira-1.png' },
    { id: 5, code: '3230 / 1511AX', name: 'ESPELHO INJETADO REFORÇADO C/ APARADOR P/ 3530', category: 'Ferragens', image: 'assets/batedeira-1.png' },
    { id: 6, code: '5001', name: 'FLANGE CARRETA DIVERSAS', category: 'Flanges', image: 'assets/batedeira-1.png' },
];