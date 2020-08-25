import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

// Ensure that i18n is initialized
require('../../src/shared/lib/i18n');
