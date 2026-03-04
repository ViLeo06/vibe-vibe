<script setup lang="ts">
// Static branch diagram — no reactive state needed
</script>

<template>
  <div class="branch-diagram-wrapper">
    <div class="diagram-scroll">
      <svg
        class="branch-svg"
        viewBox="0 0 660 210"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Git 分支示意图：展示 feature 分支从 main 分支分叉和合并的过程"
      >
        <defs>
          <marker
            id="branch-diagram-merge-arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#15a051" />
          </marker>
        </defs>

        <!-- ===== Main Branch ===== -->
        <line
          x1="80" y1="55"
          x2="600" y2="55"
          stroke="#15a051"
          stroke-width="3"
          stroke-linecap="round"
        />
        <!-- Main commits -->
        <circle cx="100" cy="55" r="7" fill="#15a051" />
        <circle cx="200" cy="55" r="7" fill="#15a051" />
        <circle cx="400" cy="55" r="6" fill="#15a051" />
        <circle cx="520" cy="55" r="8" fill="#15a051" />
        <circle cx="590" cy="55" r="6" fill="#15a051" />

        <!-- Main label -->
        <text x="100" y="30" class="svg-branch-name main-color">main</text>
        <text x="160" y="30" class="svg-branch-desc">(稳定版)</text>

        <!-- Stable indicator on main after branch point -->
        <text x="380" y="35" class="svg-stable-tag">稳定，不受影响</text>

        <!-- ===== Fork: main → feature ===== -->
        <path
          d="M 200 55 C 200 100, 230 140, 260 140"
          stroke="#2eb3df"
          stroke-width="3"
          fill="none"
          stroke-linecap="round"
        />

        <!-- ===== Feature Branch ===== -->
        <line
          x1="260" y1="140"
          x2="450" y2="140"
          stroke="#2eb3df"
          stroke-width="3"
          stroke-linecap="round"
        />
        <!-- Feature commits -->
        <circle cx="310" cy="140" r="6" fill="#2eb3df" />
        <circle cx="380" cy="140" r="6" fill="#2eb3df" />
        <circle cx="440" cy="140" r="6" fill="#2eb3df" />

        <!-- Feature label -->
        <text x="270" y="170" class="svg-branch-name feature-color">feature/recommend</text>
        <text x="270" y="190" class="svg-branch-desc">开发推荐功能</text>

        <!-- ===== Merge: feature → main (dashed) ===== -->
        <path
          d="M 450 140 C 470 140, 505 90, 518 60"
          stroke="#15a051"
          stroke-width="2.5"
          fill="none"
          stroke-dasharray="8,4"
          stroke-linecap="round"
          marker-end="url(#branch-diagram-merge-arrow)"
        />

        <!-- Merge label -->
        <text x="528" y="108" class="svg-annotation">合并</text>
      </svg>
    </div>

    <!-- Outcome cards -->
    <div class="outcomes">
      <div class="outcome-card safe">
        <span class="outcome-icon">🛡️</span>
        <div class="outcome-content">
          <span class="outcome-title">改坏了？切回 main</span>
          <span class="outcome-desc">主分支完全不受影响，随时可以切回，一切如初</span>
        </div>
      </div>
      <div class="outcome-card merge">
        <span class="outcome-icon">✅</span>
        <div class="outcome-content">
          <span class="outcome-title">改好了？合并到 main</span>
          <span class="outcome-desc">功能上线，合并后删除分支，保持仓库整洁</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '../styles/variables.css';

.branch-diagram-wrapper {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  margin: var(--spacing-lg) 0;
}

.diagram-scroll {
  overflow-x: auto;
  margin-bottom: var(--spacing-lg);
  -webkit-overflow-scrolling: touch;
}

.branch-svg {
  display: block;
  width: 100%;
  min-width: 500px;
  height: auto;
}

/* SVG text styles */
.svg-branch-name {
  font-size: 15px;
  font-weight: 700;
  font-family: var(--font-mono);
}

.main-color {
  fill: #15a051;
}

.feature-color {
  fill: #2eb3df;
}

.svg-branch-desc {
  font-size: 12px;
  fill: var(--component-text-secondary);
}

.svg-stable-tag {
  font-size: 11px;
  font-weight: 500;
  fill: #15a051;
  opacity: 0.7;
}

.svg-annotation {
  font-size: 13px;
  font-weight: 600;
  fill: var(--component-text-secondary);
}

/* Outcome cards */
.outcomes {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
}

.outcome-card {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--component-bg);
  border-radius: var(--radius-md);
  border: 1px solid var(--component-border);
  transition: box-shadow var(--transition-base);
}

.outcome-card:hover {
  box-shadow: var(--shadow-sm);
}

.outcome-card.safe {
  border-left: 3px solid #D4952C;
}

.outcome-card.merge {
  border-left: 3px solid #15a051;
}

.outcome-icon {
  font-size: 24px;
  flex-shrink: 0;
  line-height: 1;
}

.outcome-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.outcome-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.outcome-desc {
  font-size: 13px;
  color: var(--component-text-secondary);
  line-height: 1.5;
}

@media (max-width: 640px) {
  .branch-diagram-wrapper {
    padding: var(--spacing-md);
  }

  .diagram-scroll {
    margin-bottom: var(--spacing-md);
  }

  .branch-svg {
    min-width: 420px;
  }

  .outcomes {
    grid-template-columns: 1fr;
  }

  .outcome-icon {
    font-size: 20px;
  }

  .outcome-title {
    font-size: 13px;
  }

  .outcome-desc {
    font-size: 12px;
  }
}
</style>
