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
    { id: 1, code: '1400', name: 'BATEDEIRA P/ TRINCOS RETA E 1520', category: 'Batedeiras', image: 'assets/batedeira-1.png' },
    { id: 2, code: '1401', name: 'POLIDO BATEDEIRA P/ TRINCO IS 1520 E 1503', category: 'Batedeiras', image: 'assets/batedeira-1.png' },
    { id: 3, code: '1401-L', name: 'POLIDO MAXILIRA SIMPLES', category: 'Batedeiras', image: 'assets/batedeira-1.png' },
    { id: 4, code: '1507-CF', name: 'CONTRA FECHADURA COM TRINCO ROLETE', category: 'Contra Fechaduras', image: 'assets/batedeira-1.png' },
    { id: 5, code: '1507-D', name: 'CONTRA FECHADURA DOURADA', category: 'Contra Fechaduras', image: 'assets/batedeira-1.png' },
    { id: 6, code: 'DOB-01', name: 'DOBRADIÇA AUTOMÁTICA', category: 'Dobradiças e Pivôs', image: 'assets/batedeira-1.png' },
];