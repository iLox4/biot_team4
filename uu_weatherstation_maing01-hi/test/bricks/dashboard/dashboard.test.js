import UU5 from "uu5g04";
import UU5 from "uu5_tutorial_maing01-hi";

const { shallow } = UU5.Test.Tools;

describe(`UU5.Tutorial.Bricks.Dashboard.Dashboard`, () => {
  it(`default props`, () => {
    const wrapper = shallow(<UU5.Tutorial.Bricks.Dashboard.Dashboard />);
    expect(wrapper).toMatchSnapshot();
  });
});
