<?php
/**
 * @file
 * Template for a 2 column panel layout.
 *
 * This template provides a two column panel display layout, with
 * each column roughly equal in width.
 *
 * Variables:
 * - $id: An optional CSS id to use for the layout.
 * - $content: An array of content, each item in the array is keyed to one
 *   panel of the layout. This layout supports the following sections:
 *   - $content['left']: Content in the left column.
 *   - $content['right']: Content in the right column.
 */
?>
<div class="panel-display pods-three-wide clear-block" <?php if (!empty($css_id)) { print "id=\"$css_id\""; } ?>>
  <div class="panel-panel panel-col-first pod">
    <div class="pod-inner"><?php print $content['left']; ?></div>
  </div>

  <div class="panel-panel panel-col-middle pod">
    <div class="pod-inner"><?php print $content['middle']; ?></div>
  </div>

  <div class="panel-panel panel-col-last pod">
    <div class="pod-inner"><?php print $content['right']; ?></div>
  </div>
</div>