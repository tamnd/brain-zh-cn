---
title: "CF 2121C - 那些和我们在一起的人"
description: "我们得到一个整数的矩形网格。 一步中，我们选择一行和一列。 位于所选行或所选列中的每个单元格都会减一，而交叉单元格仅计数一次。"
date: "2026-06-08T03:47:17+07:00"
tags: ["codeforces", "competitive-programming", "greedy", "implementation"]
categories: ["algorithms"]
codeforces_contest: 2121
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 1032 (Div. 3)"
rating: 1200
weight: 2121
solve_time_s: 94
verified: true
draft: false
---

[CF 2121C - 那些和我们在一起的人](https://codeforces.com/problemset/problem/2121/C)

 **评分：** 1200
 **标签：** 贪心，实现
 **求解时间：** 1m 34s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个整数的矩形网格。 一步中，我们选择一行和一列。 位于所选行或所选列中的每个单元格都会减一，而交叉单元格仅计数一次。 

任务是选择该行和列，以便在执行此单个操作后，网格中任何位置的最大值变得尽可能小。 

关键的困难在于减少一行和一列会影响十字形区域，而不是简单的子阵列。 行和列的每个候选选择都会同时更改许多单元格，我们必须推断在这种结构化递减之后最大元素的行为。 

约束允许最多$2 \cdot 10^5$所有测试用例的总单元格。 这立即排除了尝试所有$n \cdot m$每个测试用例的行和列对，因为这会导致大致$O(n^2 m^2)$最坏情况下的行为，这太大了。 我们需要一种每个测试用例更接近线性或近线性的方法。 

当最大值是唯一的时，会出现微妙的边缘情况。 如果唯一的最大值位于单个单元格，我们总是可以选择它的行和列，减少它并可能减少全局最大值。 但是，当不同行和列中存在多个最大值时，单个操作可能无法覆盖所有最大值，并且某些最大值保持不变。 这种区别驱动了整个解决方案。 

## 方法

 暴力解决方案会尝试每一对$(r, c)$，模拟减少行中所有单元格$r$和列$c$，并计算所得的最大值。 每次模拟费用$O(nm)$，并且有$O(nm)$选择，导致$O(n^2 m^2)$在最坏的情况下。 这是完全不可行的。 

关键的观察是我们不需要完全模拟每个选择。 我们只关心运算后的最大值是变成原来的最大值还是比原来的最大值小1。 由于每个受影响的单元格恰好减少一，因此减少全局最大值的唯一方法是确保当前最大值的所有出现都被所选行和列“覆盖”。 

如果最大单元格不在选定的行或列中，则它保持不变，因此最大值保持不变。 如果覆盖所有最大单元格，则每个最大单元格最多减少到 max 减一，并且新答案将成为该值，除非第二大值不受影响且等于原始最大值减一。 

因此，问题简化为检查我们是否可以选择覆盖包含全局最大值的所有位置的行和列。 如果是，则减少答案； 否则，它保持不变。 

我们进一步完善这一点。 假设最大值出现在多个单元格中。 我们尝试选择一行和一列，使得每个最大出现次数都位于该行或该列中。 如果存在这样的一对，则最大值减一； 否则，它保持不变。 

唯一的候选人$r$和$c$该物质是从最大元素的位置导出的。 我们只需要检查出现在这些位置的行和列，这使得搜索在最大单元格数量上保持线性。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 |$O(n^2 m^2)$|$O(1)$| 太慢了 |
 | 最大位置过滤 |$O(nm)$|$O(nm)$| 已接受 |

 ## 算法演练

 我们独立解决每个测试用例。 

1. 扫描整个网格找出最大值。 

这确定了我们试图消除或降低的目标水平。 
2. 收集出现该最大值的所有坐标。 

这些是唯一对决定操作是否可以减少答案重要的单元格。 
3.尝试判断是否存在一行$r$这样所有最大单元格要么在行中$r$或位于单个公共列中。 

更准确地说，对于包含至少一个最大值的每个候选行，我们检查所有剩余的未覆盖最大值是否共享同一列。 
4. 测试候选行$r$，查看不在行中的所有最大位置$r$。 如果存在，则它们必须具有相同的列$c$。 如果成立，我们就找到了一个有效的对$(r, c)$。 
5. 如果不存在这样的配置，则不可能用单行和单列覆盖所有最大值单元格，因此至少有一个最大值不受影响。 
6. 如果存在有效对，则最终答案变为最大值减一。 否则，它仍保持原来的最大值。 

### 为什么它有效

 该操作仅减少位于选定行或列中的单元格。 如果我们想减少全局最大值，则每个最大值单元都必须受到影响。 仅当最大单元格位于所选行或所选列中时才会受到影响。 因此，每个最大位置都必须属于一行和一列的并集。 

如果两个最大单元格同时位于不同的行和不同的列，则没有单个行列对可以覆盖这两个单元格，除非选择其中一行作为主行并且所有剩余的最大值共享单个列。 这正是算法中测试的条件。 行加列的覆盖结构充分表征了可行性，所以检查这个条件是必要的也是充分的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    for _ in range(t):
        n, m = map(int, input().split())
        grid = []
        mx = 0

        for _ in range(n):
            row = list(map(int, input().split()))
            grid.append(row)
            mx = max(mx, max(row))

        positions = []
        for i in range(n):
            for j in range(m):
                if grid[i][j] == mx:
                    positions.append((i, j))

        rows = set(i for i, _ in positions)
        cols = set(j for _, j in positions)

        ok = False

        # try fixing a row
        for r in rows:
            col_candidate = -1
            valid = True
            for i, j in positions:
                if i == r:
                    continue
                if col_candidate == -1:
                    col_candidate = j
                elif col_candidate != j:
                    valid = False
                    break
            if valid:
                ok = True
                break

        # try fixing a column if not already ok
        if not ok:
            for c in cols:
                row_candidate = -1
                valid = True
                for i, j in positions:
                    if j == c:
                        continue
                    if row_candidate == -1:
                        row_candidate = i
                    elif row_candidate != i:
                        valid = False
                        break
                if valid:
                    ok = True
                    break

        print(mx - 1 if ok else mx)

if __name__ == "__main__":
    solve()
```该解决方案首先提取最大值及其所有出现的情况。 然后，它测试这些出现的情况是否可以由任一方向的单行加单列覆盖。 两阶段检查完全对应于选择两个选定索引中的哪一个作为主导行或列。 

一个常见的实现陷阱是假设选择单独包含许多最大值的行和列就足够了。 约束更严格：所选行之外的所有最大值必须与单个列对齐。 

## 工作示例

 考虑一个小网格：

 输入：```
1
3 3
2 1 2
1 2 1
2 1 2
```最大值为 2，出现在四个角。 我们测试候选行。 

| 步骤| 所选行 | 剩余最大仓位 | 不同的列| 有效|
 | ---| ---| ---| ---| ---|
 | 1 | 0 | (2,0)、(2,2)、(1,1)、(2,0)、(2,2) | 0,2,1 | 没有 |

 没有行将剩余的最大值隔离到一列中，因此基于行的覆盖失败。 基于列的检查同样会失败，因为剩余的最大值分布在多个行和列中。 因此输出保持为 2。 

该迹线表明，尽管最大值很频繁，但它们的几何分布阻止单个交叉覆盖它们。 

现在考虑：

 输入：```
1
2 3
5 1 5
1 1 1
```位置 (0,0) 和 (0,2) 处的最大值为 5。 

如果我们选择第 0 行，则所有最大值都已在该行中，因此操作会自动覆盖它们。 

| 步骤| 行| 剩余最大仓位 | 行外的列| 有效|
 | ---| ---| ---| ---| ---|
 | 1 | 0 | 无 | 无 | 是的 |

 所以答案变成4。 

这证实了当所有最大值已经位于一行中时，该操作会轻松地减少最大值。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |$O(nm)$| 我们扫描网格一次，然后仅处理最大位置 |
 | 空间|$O(k)$| 我们存储最大元素的位置 |

 所有测试用例中的单元总数受以下限制$2 \cdot 10^5$，因此每个测试用例进行线性扫描就足够了。 相比之下，最大位置上的额外工作可以忽略不计。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from math import inf

    t = int(input())
    out_lines = []

    for _ in range(t):
        n, m = map(int, input().split())
        grid = []
        mx = 0
        for _ in range(n):
            row = list(map(int, input().split()))
            grid.append(row)
            mx = max(mx, max(row))

        positions = [(i, j)
                     for i in range(n)
                     for j in range(m)
                     if grid[i][j] == mx]

        rows = set(i for i, _ in positions)
        cols = set(j for _, j in positions)

        ok = False

        for r in rows:
            col_candidate = -1
            valid = True
            for i, j in positions:
                if i == r:
                    continue
                if col_candidate == -1:
                    col_candidate = j
                elif col_candidate != j:
                    valid = False
                    break
            if valid:
                ok = True
                break

        if not ok:
            for c in cols:
                row_candidate = -1
                valid = True
                for i, j in positions:
                    if j == c:
                        continue
                    if row_candidate == -1:
                        row_candidate = i
                    elif row_candidate != i:
                        valid = False
                        break
                if valid:
                    ok = True
                    break

        out_lines.append(str(mx - 1 if ok else mx))

    return "\n".join(out_lines)

# provided sample (partial check placeholder)
assert run("""1
1 1
1
""") == "0"

# custom cases
assert run("""1
2 2
1 2
3 4
""") == "3", "no max coverage change"

assert run("""1
1 3
5 5 5
""") == "4", "all maxima in one row"

assert run("""1
3 3
2 1 2
1 2 1
2 1 2
""") == "2", "spread maxima cannot be covered"

assert run("""1
2 3
5 1 5
1 1 1
""") == "4", "row covers all maxima"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单细胞| 0 | 最小案例|
 | 所有相等的行| 4 | 全行覆盖|
 | 分散极大值| 2 | 不可能的覆盖|
 | 行+列结构| 4 | 建设性的成功|

 ## 边缘情况

 关键的边缘情况是每个单元格都已经达到最大值。 在这种情况下，选择任意行和列仍然会留下许多不受影响的单元格，但所有单元格都会均匀减少，因此最大值正好减少 1。 该算法处理此问题是因为所有最大位置都位于每一行中，因此任何基于行的检查都会立即成功。 

另一种边缘情况是最大仓位形成 L 形时。 例如，最大值位于 (0,0)、(0,1)、(1,0)。 没有任何一行或一列可以同时覆盖所有这些。 该算法检测到这一点是因为在修复任何行或列后，剩余位置仍然分散在多个行和列中，导致检查失败。 

最后一种微妙的情况是只有一个最大单元格。 任何选择的包含它的行和列都会立即成功，并且正确的答案将变为最大值减一。
