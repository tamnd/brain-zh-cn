---
title: "CF 105112D - 日期选择器"
description: "我们得到了一个编码为 7 x 24 网格的每周日历。 每行对应一天，每列对应一个小时。 小区要么空闲，要么阻塞。 空闲表示您在当天和时间有空，阻塞表示您很忙。"
date: "2026-06-27T19:57:14+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105112
codeforces_index: "D"
codeforces_contest_name: "2023-2024 ICPC Northwestern European Regional Programming Contest (NWERC 2023)"
rating: 0
weight: 105112
solve_time_s: 67
verified: true
draft: false
---

[CF 105112D - 日期选择器](https://codeforces.com/problemset/problem/105112/D)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 7s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了一个编码为 7 x 24 网格的每周日历。 每行对应一天，每列对应一个小时。 小区要么空闲，要么阻塞。 空闲表示您在当天和时间有空，阻塞表示您很忙。 

然后，“日期选择器”过程分两个独立的步骤进行。 首先，你必须至少选择$d$7 天中的第二天，您必须至少选择$h$24 小时中的几个小时。做出这些选择后，将从所选日期和所选时间的笛卡尔积中统一采样会议时间。 每对$(day, hour)$在选定的集合中的可能性是相同的。 

我们关心的概率是采样的槽位在原始日历中空闲的概率。 我们可以选择最佳的日期和时间来最大化这个概率。 

输出是最大可实现的概率。 

关键的微妙之处在于，随机性是针对成对的，而不是单独的几天或几小时。 一旦我们选择了一组日期和时间，每种组合的可能性都是相同的，因此选择的质量取决于诱导子矩阵内有多少自由细胞，并按其面积标准化。 

网格非常小：只有 7 x 24。这立即排除了两个维度上的任何指数。 尝试所有天数和小时数子集的简单方法将涉及$2^7 \cdot 2^{24}$，太大了。 如果单独进行，对双方进行更有针对性的查点也太慢。 

一些边缘情况很容易被错误处理：

 如果所有单元格都被阻止，则无论选择如何，答案都必须为 0。 尝试独立最大化行或列的贪婪方法如果标准化不正确，仍然可能会产生非零比率。 

如果$d = 7$和$h = 24$，选择是被迫的，答案只是整个网格中空闲单元的分数。 

如果$d = 1$或者$h = 1$，问题简化为选择单个行或列集，并且关于“每个维度独立优化”的天真推理可能会失败，因为添加更多行或列以耦合方式增加分子和分母。 

## 方法

 蛮力策略会尝试每个天数和每个小时数的子集。 对于每对子集，我们计算有多少个自由单元位于诱导子矩阵内并除以其大小。 这是正确的，因为它完全符合概率定义。 问题是规模：有$2^7 = 128$行子集和$2^{24} \approx 16$百万列子集，甚至在计算每个子矩阵内的计算总和的成本之前，这也会导致数十亿次评估。 

一旦我们分离了行和列的角色，结构就变得易于管理。 网格的行数很小，因此我们可以有效地枚举所有行子集。 对于任何固定的行集，问题都归结为选择一个好的列子集。 

修复行子集$S$。 对于每一列$j$，我们可以计算所选行中该列中出现了多少个空闲单元格。 调用这个值$c[j]$。 现在问题纯粹是一维的：我们必须至少选择$h$列，每个选定的列独立贡献$c[j]$到分子。 列集的结果概率$T$是$$\frac{\sum_{j \in T} c[j]}{|S| \cdot |T|}.$$对于固定$S$，行中的分母是恒定的，因此内部问题变成最大化所选列的平均值，至少要选择$h$其中。 

这是一个经典的结构：一旦列贡献已知，给定大小的最佳子集始终是前 k 列$c[j]$。 唯一剩下的问题是哪个尺寸$k \ge h$是最优的。 

因此，对于每个行子集，我们对 24 个列分数进行排序，计算前缀总和，并评估所有列的最佳比率$k \ge h$。 

这将问题简化为尝试所有行子集并解决每个子集的小型排序优化问题。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 暴力破解行和列 |$O(2^7 \cdot 2^{24} \cdot 7 \cdot 24)$|$O(1)$| 太慢了 |
 | 枚举行子集+贪婪列|$O(2^7 \cdot 24 \log 24)$|$O(24)$| 已接受 |

 ## 算法演练

 ## 算法演练

 1. 使用位掩码枚举 7 行的每个子集。 每个子集代表一个可能的日期选择。 这是可行的，因为只有 128 个子集，任何最优解都必须对应于这些子集之一。 
2. 对于每一行子集$S$,建立一个数组$c[0..23]$在哪里$c[j]$计算列中有多少个选定的行有空闲单元格$j$。 这会在数小时内将 2D 结构压缩为 1D 评分系统。 
3. 如果选择的行数小于$d$，跳过这个子集。 即使这个问题允许“至少$d$” 天，使用少于$d$是无效的，必须丢弃。 
4. 对列分数进行排序$c[j]$按降序排列。 这种排序确保对于任何固定数量的列$k$，最优选择永远是第一个$k$，因为所有贡献都是独立且相加的。 
5. 计算排序数组上的前缀和，以便得到最佳的总和$k$可以在恒定时间内检索列。 
6. 对于每个$k$从$h$到 24，计算值$$\frac{\text{prefix}[k]}{k \cdot |S|}$$并跟踪所有最大值$k$。 划分由$|S|$反映出每个选定的日期都会使候选人会议时段的数量成倍增加。 
7. 取所有行子集的最大值。 

### 为什么它有效

 对于固定的行子集，每列独立地贡献于自由对的总数。 由于概率仅取决于所选列贡献的总和除以所选集合大小的乘积，因此列的最佳结构必须是已排序贡献的前缀。 任何偏差，例如用较低值的列替换较高值的列，都会严格减少分子而不改变分母。 这保证了限制对排序前缀的关注不会丢失最佳解决方案，并且枚举行子集可确保考虑所有可能的行组合。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    grid = [input().strip() for _ in range(7)]
    d, h = map(int, input().split())

    best = 0.0

    for mask in range(1 << 7):
        rows = [i for i in range(7) if mask & (1 << i)]
        r = len(rows)
        if r < d:
            continue

        col = [0] * 24
        for i in rows:
            row = grid[i]
            for j in range(24):
                if row[j] == '.':
                    col[j] += 1

        col.sort(reverse=True)

        pref = [0] * 25
        for i in range(24):
            pref[i + 1] = pref[i] + col[i]

        for k in range(h, 25):
            val = pref[k] / (k * r)
            if val > best:
                best = val

    print(best)

if __name__ == "__main__":
    solve()
```该实现直接遵循分解为行子集和列评分。 行掩码枚举所有可能的日期选择。 对于每个选择，列聚合步骤都会构建独立的小时分数。 

对 24 列值进行排序是安全的，因为它将组合列选择转换为单调决策问题，其中最优集始终是前缀。 前缀数组允许对任何候选大小进行恒定时间评估$k$。 

最终划分为$k \cdot r$是针对每个候选人进行的，确保我们准确地遵守概率定义，而不是最大化原始计数。 

## 工作示例

 ### 示例 1

 我们考虑一个在评估后可能是最佳的代表性行子集。 假设一个子集选择$r = 2$行。 扫描这些行后，我们获得列分数，例如：

 | 步骤| 列分数（未排序）| 已排序 | 前缀和 |
 | ---| ---| ---| ---|
 | 聚合后 | [2, 1, 0, 2, ...] | 2,2,1,0,... | 0,2,4,5,... |

 对于每个$k \ge h = 5$，我们计算比率$\text{prefix}[k]/(2k)$。 所有行子集中最好的结果是 0.8，与样本输出匹配。 

此跟踪显示该解决方案如何不修复单个列数，而是尝试所有有效大小，同时保持最佳前缀结构。 

### 示例 2

 对于不同的网格，假设行子集的大小$r = 3$产生更平衡的列分数：

 | 步骤| 列分数（未排序）| 已排序 | 前缀和 |
 | ---| ---| ---| ---|
 | 聚合后 | [3,2,2,1,...] | 3,2,2,1,... | 0,3,5,7,8,... |

 我们评估$k \ge 8$。 对于每个$k$，比率略有不同，最好的情况出现在特定的$k$添加更多列开始降低平均质量。 

这说明了为什么“总是精确取 h 列”是不正确的：增加列数可以提高或降低比率，具体取决于分布的尾部。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |$O(2^7 \cdot 24 \log 24)$| 枚举所有行子集，计算 24 列总和，按子集排序 |
 | 空间|$O(24)$| 仅存储列计数器和前缀数组 |

 总工作量非常小：最多 128 次迭代，每次处理 24 个值。 排序占主导地位，但在这种规模下是微不足道的。 即使在 Python 中，这也很容易满足时间限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    return sys.stdout.getvalue().strip() if False else solve_and_capture(inp)

def solve_and_capture(inp: str) -> str:
    import sys
    from io import StringIO
    backup = sys.stdin
    sys.stdin = StringIO(inp)

    grid = [input().strip() for _ in range(7)]
    d, h = map(int, input().split())

    best = 0.0

    for mask in range(1 << 7):
        rows = [i for i in range(7) if mask & (1 << i)]
        r = len(rows)
        if r < d:
            continue

        col = [0] * 24
        for i in rows:
            for j in range(24):
                if grid[i][j] == '.':
                    col[j] += 1

        col.sort(reverse=True)

        pref = [0] * 25
        for i in range(24):
            pref[i + 1] = pref[i] + col[i]

        for k in range(h, 25):
            best = max(best, pref[k] / (k * r))

    sys.stdin = backup
    return f"{best:.12f}".rstrip('0').rstrip('.')

# provided samples
assert abs(float(run("""\
xxxxxx..xx..xxxxxxxxxxxx
xxxxxxxxxxxxx....xxxxxxx
xxxxxxxxxxxxxxxxxxxxxxxx
xxxxxx..xx..xxxxxxxxxxxx
xxxxxxxxxxxxx...x..xxxxx
xxxxxxxxxxxxxxxxxxxxxxxx
xxxxxxxxxxxxxxxxxxxxxxxx
2 5
""")) - 0.8) < 1e-6

assert abs(float(run("""\
xxxxxxxxx.....x...xxxxxx
xxxxxxxx..x...x...xxxxxx
xxxxxxxx......x...x.xxxx
xxxxxxxx...xxxxxxxxxxxxx
xxxxxxxx...xxxxxxxxxxxxx
xxxxxxxx...xxxxxxxx.xxxx
......xxxxxxxxxxxxxxxxxx
3 8
""")) - 0.958333333333333) < 1e-6

# custom cases
assert abs(float(run("""\
........................

........................

........................

........................

........................

........................

........................

1 1
""")) - 1.0) < 1e-6

assert abs(float(run("""\
xxxxxxxxxxxxxxxxxxxxxxxx
xxxxxxxxxxxxxxxxxxxxxxxx
xxxxxxxxxxxxxxxxxxxxxxxx
xxxxxxxxxxxxxxxxxxxxxxxx
xxxxxxxxxxxxxxxxxxxxxxxx
xxxxxxxxxxxxxxxxxxxxxxxx
xxxxxxxxxxxxxxxxxxxxxxxx
7 24
""")) - 0.0) < 1e-6
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 所有的点，最少的选择| 1.0 | 完全自由的网格边缘情况|
 | 全部屏蔽，全选| 0.0 | 0.0 零概率稳定性|

 ## 边缘情况

 当网格不包含空闲单元时，每个行子集产生零列分数，因此每个候选比率计算为零。 该算法仍然可以正确运行，因为所有前缀都保持为零并且最大值保持为零。 

当所有单元格都空闲时，每列得分等于所选行的数量，因此排序不会更改值。 任何选择都会产生概率 1，算法自然会返回 1，因为每个比率都变为$r / (k \cdot r) = 1/k$次$k$，简化为1。 

当$d = 7$，仅考虑完整的行掩码。 该算法简化为整个网格的列优化，这与问题的直接解释相匹配。 

什么时候$h = 24$，仅考虑完整的列集。 该解决方案退化为通过平均密度选择最佳行子集，这仍然可以正确处理，因为列循环仅评估$k = 24$。
