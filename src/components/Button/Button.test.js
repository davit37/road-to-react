import React from 'react';
import Enzyme, {shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {Button} from './index';


Enzyme.configure({adapter: new Adapter()})

describe('Button',()=>{
    it('Test Button ', ()=>{

        const el = shallow(
            <Button>Hide</Button>
        )

        expect(el).toMatchSnapshot();
    })
})