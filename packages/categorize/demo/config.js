const getCategories = () => {
  return [
    { id: '1', label: 'Fruit' },
    { id: '2', label: 'Vegetable' }
    // { id: '3', label: 'Category 3' },
    // { id: '4', label: 'Category 4' },
    // { id: '5', label: 'Category 5' }
  ];
};

const getChoices = () => {
  return [
    { id: '1', content: '<h1>Banana</h1>', categoryCount: 1 },
    { id: '2', content: '<div>Carrot</div>', categoryCount: 1 },
    { id: '3', content: '<div>Apple</div>' },
    { id: '4', content: '<div>Papaya</div>' }
  ];
};

module.exports = {
  elements: {
    'categorize-el': '..'
  },
  models: [
    {
      id: '1',
      element: 'categorize-el',
      disabled: false,
      categories: getCategories(),
      choices: getChoices(),
      config: {
        categories: {
          columns: 2
        },
        choices: {
          label: 'The Label',
          position: 'bottom',
          columns: 4
        }
      }
    },
    {
      id: '2',
      element: 'categorize-el',
      disabled: true,
      categories: getCategories(),
      choices: getChoices(),
      config: {
        categories: {
          columns: 2
        },
        choices: {
          label: 'The Label',
          position: 'bottom',
          columns: 4
        }
      }
    },
    {
      id: '3',
      element: 'categorize-el',
      disabled: true,
      categories: getCategories(),
      choices: getChoices(),
      incorrect: true,
      correctResponse: [{ choices: ['1'], category: '1' }],
      config: {
        categories: {
          columns: 2
        },
        choices: {
          label: 'The Label',
          position: 'bottom',
          columns: 4
        }
      }
    }
  ]
};