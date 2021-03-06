import Action from '../../action';
import CompositeResponse from '../../responses/composite-response';
import TextResponse from '../../responses/text-response';
import InterruptPromptResponse from '../../responses/interrupt-prompt-response';
import RedirectResponse from '../../responses/redirect-response';
import PropsEqual from '../../conditions/props-equal';
import If from '../../responses/if-response';

/**
 * Show message action. Can be used from anywhere. Useful when used with {@link CallActionResponse}
 * with delay.
 *
 * @author Roman Pushkin (roman.pushkin@gmail.com)
 * @date 2016-12-17
 * @version 1.1
 * @since 0.1.0
 */
export default class ShowMessage extends Action {

  /**
   * Constructor.
   */
  constructor(options) {
    super(Object.assign({ type: 'show-message' }, options));
  }

  /**
   * Conditionally show message to user the following way:
   * - interrupt current prompt (for CLI only)
   * - show message
   * - redirect back to provided `path`
   *
   * @param {object} args - hash of parameters
   * @param {number} args.message - message to show
   * @param {string} args.path - retirect path. When used with {@link CallActionResponse} with
   * `kicker`, usually the same as `kicker.menuLocation`.
   * @param {object} args.expectedState - fragment of expected user state (hash with properties).
   * Message is shown only if this fragment equals to user's state.
   * @return {CompositeResponse} - composite response
   */
  call(args) {
    return new If({
      condition: new PropsEqual(args.expectedState, this.user.state),
      ok: new CompositeResponse()
        .add(new InterruptPromptResponse())
        .add(new TextResponse({ message: args.message }))
        .add(new RedirectResponse({ path: args.path })),
    });
  }
}
