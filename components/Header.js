import React from "react";
import { Menu } from "semantic-ui-react";
import {Link} from "../routes"
function header() {
  return (
    <Menu >
      {/* <Menu.Item>Crowcoin</Menu.Item> */}
      <Link route='/'>
        <Menu.Item>
            CrowdCoin
        </Menu.Item>
      </Link>
      <Menu.Menu position="right">
        <Link route='/'>
        <Menu.Item>Campigns</Menu.Item>
      </Link>
        <Link route='/campaigns/new'>
        <Menu.Item>+</Menu.Item>
      </Link>
      </Menu.Menu>
    </Menu>
  );
}

export default header;
