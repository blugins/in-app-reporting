const { Plugin } = require('powercord/entities');
const { React, getModule, i18n: { Messages } } = require('powercord/webpack');
const { inject, uninject } = require('powercord/injector');
const { open: openModal } = require('powercord/modal');

const ReportModal = require('./components/ReportModal');

module.exports = class InAppReporting extends Plugin {
  async startPlugin () {
    const MessageContextMenu = await getModule(
      (m) => m.default?.displayName === 'MessageContextMenu'
    );
    const { MenuItem } = await getModule([ 'MenuItem' ]);
    const { MenuItemColor } = await getModule([ 'MenuItemColor' ]);
    const { getCurrentUser } = await getModule([ 'getCurrentUser' ]);

    inject(
      'in-app-reporting-context-menu',
      MessageContextMenu,
      'default',
      (args, res) => {
        if (
          args[0].message.webhookId !== null ||
          args[0].message.author.id === getCurrentUser().id
        ) {
          return res;
        }

        const { username, bot: isBot } = args[0].message.author;

        const guild = args[0].channel.guild_id;
        const channel = args[0].channel.id;
        const message = args[0].message.id;

        res.props.children[2].props.children.push(
          React.createElement(MenuItem, {
            id: 'in-app-reporting',
            key: 'in-app-reporting',
            label: Messages.REPORT_MESSAGE_MENU_OPTION,
            color: MenuItemColor.DANGER,
            action: () =>
              openModal(() =>
                React.createElement(ReportModal, {
                  username,
                  guild,
                  channel,
                  message,
                  isBot
                })
              )
          })
        );

        return res;
      }
    );
  }

  pluginWillUnload () {
    uninject('in-app-reporting-context-menu');
  }
};
