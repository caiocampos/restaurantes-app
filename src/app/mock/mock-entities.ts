import { EntityInfo } from '../model/entityInfo/entity-info';

export const ENTITIES: Array<EntityInfo> =
  [
    {
      'entity': 'Prato',
      'title': 'Pratos',
      'description': 'Pratos disponíveis',
      'userAcess': {
        'create': false,
        'read': true,
        'update': false,
        'delete': false
      },
      'queries': [
        'nomeParcialSemCaixa'
      ],
      'fields': [
        {
          'name': 'nome',
          'label': 'Nome',
          'type': 'TEXT',
          'options': [],
          'fk': null,
          'required': true,
          'size': 3
        },
        {
          'name': 'preco',
          'label': 'Preço',
          'type': 'VALUE',
          'options': [],
          'fk': null,
          'required': false,
          'size': 3
        },
        {
          'name': 'restaurante',
          'label': 'Restaurante',
          'type': 'FOREIGN',
          'options': [],
          'fk': {
            'entity': 'RestauranteDocument',
            'search': 'nomeParcialSemCaixa',
            'param': 'nome'
          },
          'required': false,
          'size': 3
        }
      ]
    },
    {
      'entity': 'User',
      'title': 'Usuários',
      'description': 'Usuários do Sistema',
      'userAcess': {
        'create': false,
        'read': true,
        'update': false,
        'delete': false
      },
      'queries': [
        'nomeParcialSemCaixa'
      ],
      'fields': [
        {
          'name': 'nome',
          'label': 'Nome',
          'type': 'TEXT',
          'options': [],
          'fk': null,
          'required': true,
          'size': 3
        },
        {
          'name': 'sobrenome',
          'label': 'Sobrenome',
          'type': 'TEXT',
          'options': [],
          'fk': null,
          'required': false,
          'size': 3
        },
        {
          'name': 'username',
          'label': 'Nome de usuário',
          'type': 'TEXT',
          'options': [],
          'fk': null,
          'required': true,
          'size': 3
        },
        {
          'name': 'password',
          'label': 'Senha',
          'type': 'PASS',
          'options': [],
          'fk': null,
          'required': true,
          'size': 3
        },
        {
          'name': 'roles',
          'label': 'Acessos',
          'type': 'LIST',
          'options': [
            'user',
            'admin'
          ],
          'fk': null,
          'required': false,
          'size': 3
        },
        {
          'name': 'enabled',
          'label': 'Ativo',
          'type': 'TOGGLE',
          'options': [],
          'fk': null,
          'required': false,
          'size': 1
        }
      ]
    },
    {
      'entity': 'Restaurante',
      'title': 'Restaurantes',
      'description': 'Restaurantes disponíveis',
      'userAcess': {
        'create': false,
        'read': true,
        'update': false,
        'delete': false
      },
      'queries': [
        'nomeParcialSemCaixa'
      ],
      'fields': [
        {
          'name': 'nome',
          'label': 'Nome',
          'type': 'TEXT',
          'options': [],
          'fk': null,
          'required': true,
          'size': 3
        },
        {
          'name': 'telefone',
          'label': 'Telefone',
          'type': 'PHONE',
          'options': [],
          'fk': null,
          'required': false,
          'size': 3
        },
        {
          'name': 'endereco',
          'label': 'Endereço',
          'type': 'TEXTAREA',
          'options': [],
          'fk': null,
          'required': false,
          'size': 3
        }
      ]
    }
  ];
