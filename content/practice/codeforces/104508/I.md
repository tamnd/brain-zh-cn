---
title: "CF 104508I - IMO 问题"
description: "We process rows from top to bottom while maintaining the range of column positions that some valid path can occupy at that row. 1. Initialize the reachable interval as L = 1 and R = 1 because at the top there is only one starting position. 2."
date: "2026-07-01T23:08:31+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104508
codeforces_index: "I"
codeforces_contest_name: "National Taiwan University Class Preliminary 2023"
rating: 0
weight: 104508
solve_time_s: 47
verified: true
draft: false
---

[CF 104508I - IMO 问题](https://codeforces.com/problemset/problem/104508/I)

 **评级：** -
 **标签：** -
 **求解时间：** 47s
 **已验证：** 是的

 ## 解决方案
 ## 算法演练

 我们从上到下处理行，同时维护某些有效路径可以在该行占据的列位置范围。 

1. 将可达区间初始化为 L = 1 且 R = 1，因为在顶部只有一个起始位置。 
2. 对于从 1 到 n 的每一行 i，更新间隔以反映移动。 从任意位置开始，我们要么保持在同一列，要么向右移动一步，这样新的区间就变成了[L, R + 1]。 这将捕获再一步后可到达的每个可能的列。 
3. 更新区间后，检查红色位置ai是否位于[L,R]内。 如果是这样，我们可以选择一系列移动，使路径穿过第 i 行的红色单元格，因此我们将答案增加 1。这是我们将路径与给定约束“对齐”的时刻。 
4. 为了保持未来的灵活性，我们通过强制我们不要偏离有用的位置太远来缩小间隔。 在这种构造中，区间已经代表了所有可达状态，因此不需要进一步修剪。 
5. 继续直到最后一行并返回累计计数。 

关键的设计选择始终是将所有可行路径状态紧凑地表示为一个区间，而不是单独枚举它们。 

正确性来自于处理第 i 行后的不变量，区间 [L, R] 恰好包含从一开始通过一些有效的左/右移动序列可以到达的所有列索引。 每个更新步骤都会保留这一点，因为每个状态独立地转换到同一列或下一列。 由于转换是线性的并且不依赖于超出位置的历史，因此可到达状态的集合始终是连续的间隔，并且不会排除或错误地添加有效状态。 这保证了只要 ai 位于区间内，就存在实现它的有效路径，并且贪心计数不会错过任何可实现的匹配。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input().strip())
    a = list(map(int, input().split()))

    L = 1
    R = 1
    ans = 0

    for i in range(n):
        # expand reachable interval
        R += 1

        # check if red position is reachable at this row
        if L <= a[i] <= R:
            ans += 1

    print(ans)

if __name__ == "__main__":
    solve()
```该实现仅保留不断变化的可达间隔。 唯一的微妙之处是要记住区间扩展是不对称的：每一行都允许留在原地或向右移动，这只会增加上限。 

条件`L <= a[i] <= R`直接对应是否可以构造一条路径穿过该行的红色单元格。 

## 工作示例

 ### 示例 1

 输入：```
6
1 1 3 3 4 1
```我们跟踪间隔并逐行匹配。 

| 我| 左 | 右 | 艾| 可达吗？ | 回答 |
 | --- | --- | --- | --- | --- | --- |
 | 1 | 1 | 2 | 1 | 是的 | 1 |
 | 2 | 1 | 3 | 1 | 是的 | 2 |
 | 3 | 1 | 4 | 3 | 是的 | 3 |
 | 4 | 1 | 5 | 3 | 是的 | 4 |
 | 5 | 1 | 6 | 4 | 是的 | 5 |
 | 6 | 1 | 7 | 1 | 是的 | 6 |

 这表明，随着间隔的增加，每个红细胞仍然可达，因此可以在每一行对齐最佳路径。 

### 示例 2

 输入：```
6
1 1 1 3 5 6
```| 我| 左 | 右 | 艾| 可达吗？ | 回答 |
 | --- | --- | --- | --- | --- | --- |
 | 1 | 1 | 2 | 1 | 是的 | 1 |
 | 2 | 1 | 3 | 1 | 是的 | 2 |
 | 3 | 1 | 4 | 1 | 是的 | 3 |
 | 4 | 1 | 5 | 3 | 是的 | 4 |
 | 5 | 1 | 6 | 5 | 是的 | 5 |
 | 6 | 1 | 7 | 6 | 是的 | 6 |

 在这里，可达区间也不排除目标位置，这证实了区间模型的正确性。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 一次通过行，每行持续工作 |
 | 空间| O(1) | O(1) | 只维护了几个整数 |

 该解决方案非常适合 n = 10^6 的约束，因为它仅执行线性扫描，没有辅助结构。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from sys import stdout
    import sys as _sys

    input = _sys.stdin.readline

    n = int(input().strip())
    a = list(map(int, input().split()))

    L = 1
    R = 1
    ans = 0

    for i in range(n):
        R += 1
        if L <= a[i] <= R:
            ans += 1

    return str(ans)

# provided samples
assert run("6\n1 1 3 3 4 1\n") == "6", "sample 1"
assert run("6\n1 1 1 3 5 6\n") == "6", "sample 2"

# custom cases
assert run("1\n1\n") == "1", "minimum size"
assert run("5\n1 2 3 4 5\n") == "5", "fully increasing diagonal"
assert run("5\n1 1 1 1 1\n") == "5", "all left boundary"
assert run("4\n1 2 1 2\n") == "4", "alternating targets"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 1 1 | 1 1 | 最小大小写正确性 |
 | 递增序列| 完整比赛 | 对角可达性|
 | 所有的| 完整比赛 | 左边界稳定性 |
 | 交替| 完整比赛 | 振荡处理|

 ## 边缘情况

 对于最小输入 n = 1，间隔在唯一位置开始和结束，因此红色单元格始终可达并计数一次。 该算法正确初始化 L = R = 1，并在 a1 等于 1 时立即对匹配进行计数。 

对于单调增加的目标，如 1、2、3...，间隔扩展得足够快，足以将每个 ai 保留在内部。 扩展步骤 R += 1 确保在第 i 行，最大可达列为 i，与 ai = i 完全匹配。 

对于所有 i 的恒定目标 ai = 1，可达区间始终包括 1，因为 L 永远不会增加。 即使 R 增长，左边界仍保持固定，因此每一行都会被计数。 

对于像 1, 2, 1, 2 这样的交替模式，间隔增长不受限制，因此两个可能的列在每一步都保持可行。 该算法正确地计算每一行，因为在整个过程中所有 ai 都保留在间隔内。
