const { React, getModule, i18n: { Messages } } = require('powercord/webpack');
const { Button, FormTitle } = require('powercord/components');
const { RadioGroup } = require('powercord/components/settings');
const { Modal } = require('powercord/components/modal');
const { close: closeModal } = require('powercord/modal');

const { report } = getModule([ 'report', 'submitReport' ], false);

module.exports = class ReportModal extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      reason: ''
    };
  }

  render () {
    const { guild, channel, message } = this.props;

    return (
      <Modal className='powercord-text' size={Modal.Sizes.SMALL}>
        <Modal.Header>
          <FormTitle tag='h3'>
            {Messages.REPORT_MESSAGE.format({ name: this.props.username })}
          </FormTitle>
          <Modal.CloseButton onClick={closeModal} />
        </Modal.Header>
        <Modal.Content>
          <RadioGroup
            onChange={(e) => this.setState({ reason: e.value })}
            value={this.state.reason ?? 2}
            options={[
              {
                value: 0,
                name: 'Illegal content',
                desc: 'Child pornography, solicitation of minors, terrorism, threats of school shootings or criminal activity.'
              },
              {
                value: 1,
                name: 'Harassment',
                desc: 'Threats, stalking, bullying, sharing of personal information, impersonation or raiding.'
              },
              {
                value: 2,
                name: 'Spam or phishing links',
                desc: 'Fake links, invites to a server via bot, malicious links or attachments.'
              },
              !this.props.isBot && {
                value: 3,
                name: 'Self harm',
                desc: 'Person is at risk of claimed intent of self-harm.'
              },
              {
                value: 4,
                name: 'NSFW content',
                desc: 'Pornography or other adult content in a non-NSFW channel or unwanted DM.'
              }
            ].filter((e) => e)}
          >
            What is it you're reporting?
          </RadioGroup>
        </Modal.Content>
        <Modal.Footer>
          <Button
            disabled={this.state.reason === ''}
            onClick={() => {
              report({
                guild_id: guild,
                channel_id: channel,
                message_id: message,
                reason: this.state.reason
              });
              closeModal();
            }}
          >
            Report
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
};
