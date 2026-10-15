---
title: "CF 106113I - Cristales M\u00e1gicos"
description: "我们有N个水晶。 每颗水晶都属于一个由颜色名称标识的家族，并具有能量值。 我们必须精确地选择 K 个晶体，但所选择的两个晶体不能来自同一族。 目标是最大化他们的权力总和。"
date: "2026-06-25T11:39:19+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 106113
codeforces_index: "I"
codeforces_contest_name: "Coding Cup TecNM 2025"
rating: 0
weight: 106113
solve_time_s: 51
verified: true
draft: false
---

[CF 106113I - Cristales M\u00e1gicos](https://codeforces.com/problemset/problem/106113/I)

 **评级：** -
 **标签：** -
 **求解时间：** 51s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有`N`晶体。 每颗水晶都属于一个由颜色名称标识的家族，并具有能量值。 

我们必须准确选择`K`晶体，但限制是任何两个选定的晶体不能来自同一家族。 目标是最大化他们的权力总和。 

如果因为数量少于而不可能`K`不同的家庭，我们打印`IMPOSIBLE`。 

如果几个选择达到相同的最大总功率，我们必须输出晶体索引排序列表按字典顺序最小的一个。 

输入大小是主要挑战。 最多可以有`10^6`水晶和姓氏可以是长字符串。 任何比较所有晶体对或重复对大型集合进行排序的解决方案都会太慢。 该算法必须基本上处理每个晶体一次，并且仅保留每个系列的聚合信息。 

一个微妙的细节是字典顺序的平局打破。 仅将权力最大化是不够的。 两个不同的最优选择可以具有相同的总功效，并且我们必须仔细选择产生最小字典排序序列的索引。 

考虑这个例子：```
4 1
RED 10
RED 10
BLUE 10
GREEN 5
```最大功率为`10`。 

可能的最佳答案是选择索引`1`,`2`， 或者`3`。 

正确的输出是索引`1`， 因为`[1]`按字典顺序小于`[2]`或者`[3]`。 

当几个家族拥有相同的最佳功率并争夺最后一个可用插槽时，就会出现另一个重要情况。```
5 2
A 10
B 10
C 10
D 5
E 1
```任意两个`A`,`B`， 和`C`给出相同的最大总和`20`。 

正确答案使用索引`[1, 2]`， 不是`[1, 3]`或者`[2, 3]`， 因为`[1, 2]`按字典顺序最小。 

最后一种边缘情况是当一个系列包含多个具有相同最大功率的晶体时。```
4 2
RED 7
RED 7
BLUE 5
GREEN 1
```对于家庭`RED`，两个指数`1`和`2`达到同样的贡献。 选择索引`1`按字典顺序至少总是与选择索引一样好`2`。 

## 方法

 暴力解决方案会尝试每个子集`K`晶体，检查所有族是否不同，计算总功率，并保留最佳有效选择。 即使是为了`N = 50`，这已经是无望的了，因为子集的数量呈指数级增长。 和`N = 10^6`，这样的做法是完全不可能的。 

第一个观察结果是，对于任何家庭来说，只有其最强的晶体才能出现在最佳解决方案中。 如果一个家庭拥有权力`3`,`8`， 和`12`，选择除了有力量的水晶之外的任何东西`12`只能降低总功率。 

这使我们能够将每个系列压缩为一个值：`V = maximum power in that family`。 

还有一个并发症。 一个家族可能包含多个水晶，其力量等于`V`。 由于它们都贡献相同的数量，因此我们应该保留其中最小的索引。 任何更大的索引只会使最终答案在字典顺序上变得更糟。 

经过这样的压缩，每个家庭都变成了：```
(best_power, best_index)
```现在问题变成：

 准确选择`K`家庭。 

每个被选中的家庭都贡献自己的力量`best_power`。 

在所有最大功率选择中，返回所选索引的字典顺序最小排序列表。 

为了最大化功率，我们只需采取`K`最大的家族权力。 

唯一的歧义发生在几个家庭共享切断电源时。 

认为：```
powers = [15, 12, 12, 12, 8]
K = 3
```有权力的家族`15`必须被选择。 

有权力的家族`8`永远不能被选择。 

三大势力家族之中`12`，我们还需要两个选择。 

由于所有这些家族都贡献了完全相同的力量，所以字典顺序就成为决定因素。 我们应该选择代表指数最小的家庭。 

这给出了一个干净的策略：

 1. 计算每个族的最大功率和实现该功率的最小指数。 
2. 按权力对家庭进行排序。 
3.确定截止功率。 
4. 选择严格高于截止值的所有家庭。 
5. 在等于截止值的家庭中，根据需要选择尽可能多的家庭，优先选择较小的代表性指数。 
6. 对结果索引进行排序并打印它们。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | 指数| 指数| 太慢了 |
 | 最佳 | O(N + F log F) | O(N + F log F) | O(F) | 已接受 |

 这里`F`是不同家庭的数量。 

## 算法演练

 1. 读取所有晶体并按姓氏将它们分组。 
2. 对于每个家庭，维持两个价值观：

 - 迄今为止看到的最大功率。 
- 其幂等于该最大值的最小索引。 
3.处理完所有晶体后，让`F`是不同家庭的数量。 
4.如果`F < K`， 打印`IMPOSIBLE`因为从每个家族中选择一颗水晶仍然不足以提供足够的水晶。 
5.将每个家庭变成一对`(power, index)`在哪里：

-`power`是家族的最大权力。 
-`index`是达到该功效的最小指数。 
6. 按功率递减对这些对进行排序。 
7.让`T`成为的力量`K`此顺序中的第 - 个家庭。 这就是截止功率。 
8. 选择权力大于的每个家庭`T`。 它们的包含是强制性的，因为更换其中任何一个都会降低总功率。 
9. 计算还需要多少个额外的家庭。 
10.收集所有权力相等的家庭`T`。 
11. 按代表性索引对这些阈值族进行排序，并准确取所需的数量。 
12. 收集所有选定的指数，对它们进行递增排序，并将它们与总功率一起打印。 

### 为什么它有效

 每个家庭都独立贡献总力量。 用同一系列中的另一个晶体替换所选晶体永远无法将总功率提高到超出该系列的最大功率，因此每个最佳解决方案都必须使用每个所选系列中的最大功率晶体。 

将每个家庭减少到其最大可实现的贡献后，最大化总权力就相当于选择`K`最大的家族权力。 任何严格高于截止值的族都必须属于每个最优解，而任何严格低于截止值的族永远不可能属于最优解。 

唯一的自由来自于处于断电状态的家庭。 由于所有这些家庭贡献的金额相同，因此无论选择哪一个，总权力都保持不变。 为了获得按字典顺序排列的最小排序索引列表，我们在这些绑定族中选择最小的代表索引。 任何其他选择都会用较大的索引替换较小的索引，并使排序序列按字典顺序更大。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, k = map(int, input().split())

    families = {}

    for idx in range(1, n + 1):
        color, power = input().split()
        power = int(power)

        if color not in families:
            families[color] = [power, idx]
        else:
            best_power, best_idx = families[color]

            if power > best_power:
                families[color] = [power, idx]
            elif power == best_power and idx < best_idx:
                families[color][1] = idx

    if len(families) < k:
        print("IMPOSIBLE")
        return

    items = [(p, idx) for p, idx in families.values()]
    items.sort(key=lambda x: -x[0])

    threshold = items[k - 1][0]

    chosen_indices = []
    total_power = 0

    equal_group = []

    for power, idx in items:
        if power > threshold:
            chosen_indices.append(idx)
            total_power += power
        elif power == threshold:
            equal_group.append((idx, power))

    need = k - len(chosen_indices)

    equal_group.sort()

    for idx, power in equal_group[:need]:
        chosen_indices.append(idx)
        total_power += power

    chosen_indices.sort()

    print(total_power)
    print(*chosen_indices)

solve()
```字典里只储存了每个家庭最好的水晶。 当发现更大的力量时，家族记录就会被替换。 当再次出现相同的最大功率时，保留较小的索引。 

所有族都被压缩后，算法就不再需要原始晶体了。 排序后的族列表决定了截止功率。 高于截止值的家庭是每个最优解决方案的固定成员，而绑定家庭则单独处理。 

阈值组按索引排序，因为平局规则取决于所选索引的最终字典顺序，而不是姓氏或权力。 

Python 整数可以安全地处理总功率，因为​​最大可能的总和是`10^6 × 10^9 = 10^15`，完全在 Python 的任意精度整数范围内。 

## 工作示例

 ### 示例 1

 输入：```
5 3
ROJO 5
AZUL 3
ROJO 4
VERDE 6
AZUL 2
```家庭压缩产生：

 | 家庭| 最佳电源| 代表索引|
 | ---| ---| ---|
 | 罗霍 | 5 | 1 |
 | 蔚蓝| 3 | 2 |
 | 佛得角 | 6 | 4 |

 按功率排序：

 | 电源| 索引 |
 | ---| ---|
 | 6 | 4 |
 | 5 | 1 |
 | 3 | 2 |`K = 3`，因此所有家庭都被选中。 

| 步骤| 精选指数| 总功率|
 | ---| ---| ---|
 | 选择维德 | [4] | 6 |
 | 选择ROJO| [4,1]| 11 | 11
 | 选择蔚蓝| [4,1,2]| 14 | 14

 排序索引：```
1 2 4
```输出：```
14
1 2 4
```此示例显示了必须选择每个不同族的基本情况。 

### 示例 2

 输入：```
5 2
A 10
B 10
C 10
D 5
E 1
```压缩家庭：

 | 家庭| 电源| 索引 |
 | ---| ---| ---|
 | 一个 | 10 | 10 1 |
 | 乙| 10 | 10 2 |
 | C | 10 | 10 3 |
 | d | 5 | 4 |
 | 电子| 1 | 5 |

 截止功率为`10`。 

三个家庭在截止点上并列，但只能选择两个家庭。 

| 候选索引| 选定了？ |
 | ---| ---|
 | 1 | 是的 |
 | 2 | 是的 |
 | 3 | 没有 |

 最终指标：```
1 2
```这演示了字典顺序决胜是如何解决的。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(N + F log F) | O(N + F log F) | 遍历所有晶体，然后对不同的家族进行排序 |
 | 空间| O(F) | 每个不同家族一份记录|`F`至多是`N`，所以最坏的情况是`O(N log N)`。 和`N = 10^6`，这对于竞赛限制来说足够有效。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    data = io.StringIO(inp)
    input = data.readline

    n, k = map(int, input().split())

    families = {}

    for idx in range(1, n + 1):
        color, power = input().split()
        power = int(power)

        if color not in families:
            families[color] = [power, idx]
        else:
            bp, bi = families[color]
            if power > bp:
                families[color] = [power, idx]
            elif power == bp and idx < bi:
                families[color][1] = idx

    out = []

    if len(families) < k:
        out.append("IMPOSIBLE")
        return "\n".join(out)

    items = [(p, idx) for p, idx in families.values()]
    items.sort(key=lambda x: -x[0])

    threshold = items[k - 1][0]

    chosen = []
    total = 0
    eq = []

    for p, idx in items:
        if p > threshold:
            chosen.append(idx)
            total += p
        elif p == threshold:
            eq.append((idx, p))

    need = k - len(chosen)

    eq.sort()

    for idx, p in eq[:need]:
        chosen.append(idx)
        total += p

    chosen.sort()

    out.append(str(total))
    out.append(" ".join(map(str, chosen)))
    return "\n".join(out)

# provided samples
assert run(
"""5 3
ROJO 5
AZUL 3
ROJO 4
VERDE 6
AZUL 2
"""
) == "14\n1 2 4"

assert run(
"""4 3
AMARILLO 4
GRIS 5
AMARILLO 6
GRIS 7
"""
) == "IMPOSIBLE"

# minimum size with one family
assert run(
"""3 1
A 5
A 7
A 6
"""
) == "7\n2"

# equal maximum power inside a family
assert run(
"""4 2
A 10
A 10
B 5
C 1
"""
) == "15\n1 3"

# cutoff tie between families
assert run(
"""5 2
A 10
B 10
C 10
D 5
E 1
"""
) == "20\n1 2"

# all families distinct
assert run(
"""4 4
A 1
B 2
C 3
D 4
"""
) == "10\n1 2 3 4"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 一个家庭，K=1 | 精选最佳水晶 | 基本正确性 |
 | 家庭中的平等最大值| 保留的最小索引 | 家庭内部领带处理 |
 | 三向截止领带 | 选择的最小指数 | 字典顺序|
 | K 等于家庭数量 | 所有已选择的家庭| 边界条件|
 | 少于 K | 的不同族 不可能 | 可行性检查|

 ## 边缘情况

 考虑：```
4 3
AMARILLO 4
GRIS 5
AMARILLO 6
GRIS 7
```只有两个家庭存在：`AMARILLO`和`GRIS`。 

该算法计算：```
F = 2
K = 3
```自从`F < K`，它立即打印：```
IMPOSIBLE
```不需要进一步处理。 

现在考虑：```
4 2
RED 7
RED 7
BLUE 5
GREEN 1
```家庭压缩给出：

 | 家庭| 最佳电源| 索引 |
 | ---| ---| ---|
 | 红色| 7 | 1 |
 | 蓝色| 5 | 3 |
 | 绿色| 1 | 4 |

 尽管指数`2`与索引具有相同的功效`1`，代表指标变为`1`。 

选定的家庭是`RED`和`BLUE`。 

输出：```
12
1 3
```自动满足字典顺序要求，因为在预处理过程中存储了达到族最大值的最小索引。 

最后，考虑：```
5 2
A 10
B 10
C 10
D 5
E 1
```截止功率为`10`。 阈值组包含索引`[1,2,3]`。 

该算法需要其中两个，因此取最小的两个：```
[1,2]
```任何其他选择都会产生字典序上更大的排序序列，同时给出相同的总功率。
