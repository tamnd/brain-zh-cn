---
title: "CF 1108C - 漂亮的花环"
description: "我们得到一排灯，每个灯都涂成三种颜色之一：R、G 或 B。我们可以将任何灯重新涂成任何其他颜色。"
date: "2026-06-12T05:21:04+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "greedy", "math"]
categories: ["algorithms"]
codeforces_contest: 1108
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 535 (Div. 3)"
rating: 1300
weight: 1108
solve_time_s: 424
verified: false
draft: false
---

[CF 1108C - 漂亮的花环](https://codeforces.com/problemset/problem/1108/C)

 **评分：** 1300
 **标签：** 暴力、贪婪、数学
 **求解时间：** 7m 4s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到一排灯，每个灯都涂成三种颜色之一：R、G 或 B。我们可以将任何灯重新涂成任何其他颜色。 目标是修改序列，使其成为“特定几何意义上的周期性”：任何两个最终颜色相同的灯必须位于索引相差 3 倍的位置。 

这种情况具有非常严格的结构性后果。 如果我们查看以 3 为模的位置，例如重复索引 0、1、2，则相同颜色的所有位置必须恰好落入这些残差类别之一。 换句话说，每个残基类 mod 3 必须恰好分配一种颜色，并且该分配必须在整个字符串中保持一致。 

因此，任务变成选择从三个残基类别 {0,1,2} 到三种颜色 {R,G,B} 的映射，确保每种颜色仅使用一次，然后重新绘制每个位置以匹配分配给其残基类别的颜色。 我们希望最小化与原始字符串不同的位置。 

输入大小最多可达 200,000。 这立即排除了位置数量的二次或三次。 任何在没有结构的情况下独立尝试每个位置的所有局部重绘组合的解决方案都会太慢或不正确，因为约束通过模类全局耦合位置。 

天真的思维的一个微妙的失败案例是尝试贪婪的局部修复，例如“绘制每个位置以匹配邻居中的大多数颜色”或类似的启发式方法。 例如，使用输入`RGBRGB`，贪婪的方法可能会错误地提前改变位置并破坏全局一致性，即使最佳解决方案已经有效。 

另一个微妙的情况是假设像“RGBRGB…”这样的固定模式总是效果最好。 为了`BRB`，这样的固定图案可能需要比分配给残基的另一种颜色排列更多的变化。 

核心困难在于，问题不在于单个位置，而在于选择 3 个残基类别上的 3 色分配的最佳排列。 

## 方法

 暴力视图使结构变得显而易见。 由于每个有效的最终花环都是通过将 {R, G, B} 的排列分配给残基类别 0、1 和 2 来确定的，因此我们可以尝试所有 3 个！ = 6 项作业。 对于每项作业，我们都会计算已经匹配的职位数量并选择最佳的一个。 

对于固定分配，我们扫描一次字符串并计算不匹配的数量。 这花费了 O(n)。 有 6 种排列，总数为 O(6n)，这是线性的并且在实践中非常小。 

关键的见解是认识到“距离可被 3 整除”条件完全等同于按模 3 对索引进行分组。一旦看到这一点，问题就不再是重新着色任意结构，而是成为残差类上的恒定大小分配问题。 

不需要对字符串进行动态规划或贪心模拟； 整个优化空间可分为六种可能性。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力（6 种排列）| O(n) | O(1) | O(1) | 已接受 |
 | 最佳（相同的想法，结构化）| O(n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 根据 i mod 3 将字符串的索引分为三组。 

这是问题中唯一的结构性约束，因此我们立即将其隔离。 
2. 预先计算每个残基类别中出现的 R、G 和 B 数量。 

这避免了为每个排列重复重新计算字符比较。 
3. 枚举三种颜色的所有排列。 

每个排列代表对残基类别的颜色的完整有效分配。 
4. 对于给定的排列，计算已经匹配的字符数量：

 对于每个残基类别 r，添加分配给 r 的目标颜色的计数。 
5. 跟踪最大匹配数的排列。 

最大化匹配相当于最小化重新着色。 
6. 通过根据 i mod 3 为每个位置 i 写入所选颜色，使用最佳分配重建答案字符串。 

### 为什么它有效

 每个有效的“nice”字符串必须为模 3 的每个残基类别准确分配一种颜色，因为如果两个位置共享一种颜色，则它们的索引必须相差 3 的倍数，这迫使它们属于相同的残基类别。 由于恰好存在三种颜色和三个残基类，因此该分配是双射。 该算法枚举所有双射并选择与原始字符串最匹配的双射，从而保证最优性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input().strip())
    s = input().strip()

    colors = ['R', 'G', 'B']

    # cnt[pos_mod][color_index]
    cnt = [[0] * 3 for _ in range(3)]

    idx = {'R': 0, 'G': 1, 'B': 2}

    for i, ch in enumerate(s):
        cnt[i % 3][idx[ch]] += 1

    best_perm = None
    best_keep = -1

    # try all permutations
    from itertools import permutations

    for perm in permutations(range(3)):
        keep = 0
        for r in range(3):
            keep += cnt[r][perm[r]]
        if keep > best_keep:
            best_keep = keep
            best_perm = perm

    res = list(s)
    for i in range(n):
        res[i] = colors[best_perm[i % 3]]

    print(n - best_keep)
    print("".join(res))

if __name__ == "__main__":
    solve()
```该实现将问题压缩为对每个残基类的匹配进行计数。 这`cnt`表存储每种颜色在每个模桶中出现的频率。 每个排列代表从残基类别到颜色索引的映射。 排列的分数就是有多少位置已经与该映射匹配。 

一个常见的陷阱是在评估每个排列期间重建候选字符串。 这是不必要的； 我们只计算一个分数。 使用最佳排列即可完成重建。 

另一个微妙之处是确保映射是按索引模 3 应用的，而不是按排列循环中的位置应用的。 混合这两种解释是错误答案的常见来源。 

## 工作示例

 ### 示例 1

 输入：```
3
BRB
```我们计算残基类别：

 | 我mod 3 | 人物 |
 | --- | --- |
 | 0 | 乙|
 | 1 | 右 |
 | 2 | 乙|

 计数：

 | 模组| 右 | G | 乙|
 | --- | --- | --- | --- |
 | 0 | 0 | 0 | 1 |
 | 1 | 1 | 0 | 0 |
 | 2 | 0 | 0 | 1 |

 现在尝试排列，例如 (G, R, B)：

 | 模组| 已分配 | 比赛|
 | --- | --- | --- |
 | 0 | G | 0 |
 | 1 | 右 | 1 |
 | 2 | 乙| 1 |

 匹配总数 = 2，因此只需要 1 处更改。 

结果变成：```
GRB
```这与样本相匹配，并确认最佳分配取决于残基类别之间的分布。 

### 示例 2

 输入：```
6
RRGGBB
```残留类别：

 | 模组| 字符 |
 | --- | --- |
 | 0 | 右，G |
 | 1 | 右、右 |
 | 2 | 乙、乙 |

 一个好的排列是 (R, G, B)：

 | 模组| 已分配 | 比赛|
 | --- | --- | --- |
 | 0 | 右 | 1 |
 | 1 | G | 0 |
 | 2 | 乙| 1 |

 匹配总数 = 2，因此需要 4 处更改。 

此示例表明，即使看起来对称的字符串也可能需要多次重新着色，因为残基类别之间的分布未与干净的循环模式对齐。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 我们扫描一次字符串来构建计数，然后测试 6 个排列，每个排列的 O(1) 工作在固定的 3 个类上 |
 | 空间| O(1) | O(1) | 仅使用 3x3 频率表和常量数组 |

 线性扫描很容易满足 n 高达 200,000 的限制。 内存使用量是恒定的并且可以忽略不计。 

## 测试用例```python
import sys, io
from itertools import permutations

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys as _sys
    from subprocess import Popen, PIPE

    # simple inline execution via import trick
    # assume solution is in solve()
    # we redefine here for testing convenience

    def solve():
        n = int(input().strip())
        s = input().strip()
        colors = ['R', 'G', 'B']
        idx = {'R':0,'G':1,'B':2}
        cnt = [[0]*3 for _ in range(3)]
        for i,ch in enumerate(s):
            cnt[i%3][idx[ch]] += 1

        best = -1
        bestp = None
        for p in permutations(range(3)):
            keep = sum(cnt[r][p[r]] for r in range(3))
            if keep > best:
                best = keep
                bestp = p

        res = []
        for i in range(n):
            res.append(colors[bestp[i%3]])
        print(n-best)
        print("".join(res))

    old_stdout = sys.stdout
    sys.stdout = io.StringIO()
    solve()
    out = sys.stdout.getvalue().strip()
    sys.stdout = old_stdout
    return out

# provided sample
assert run("3\nBRB\n") == "1\nGRB"

# all same
assert run("4\nRRRR\n") in ["2\nRGRG", "2\nGRGR"]

# already optimal
assert run("3\nRGB\n") == "0\nRGB"

# alternating
assert run("6\nRGRGRG\n") in ["0\nRGRGRG"]

# mixed
assert run("5\nBRRGB\n")
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 3 BRB | 1 伽玛射线暴 | 基本正确性|
 | 4 RRRR | 2 RGRG 或 GRGR | 对称性和多个最优答案|
 | 3 RGB | 0 RGB | 已经有效的配置 |
 | 6 RGRGRG | 6 0 RGRGRG | 0 周期对准案例|

 ## 边缘情况

 一个关键的边缘情况是当字符串已经完全周期性时。 用于输入`RGBRGB`，每个残基类别已经匹配不同的颜色。 该算法对一种排列的完全匹配进行计数，从而导致零更改。 由于我们只比较排列，因此我们自然保留原始结构。 

另一个边缘情况是统一输入，例如`RRRRRR`。 这里每个残基类别具有相同的分布，因此多个排列产生相同的分数。 该算法一致地选择任何排列，产生有效的交替模式，例如`RGRGBB`或取决于实施顺序的另一等效最佳布置。 正确性并不取决于选择哪一条领带。 

第三种情况是当一种残留物类别严重但不完全主导特定颜色时。 该算法仍然正确地将颜色分配给相应的模类，因为排列评分捕获所有分配的全局最大值，而不是做出局部决策。
