---
title: "CF 69C - 游戏"
description: "每个玩家都拥有多组文物。 有些神器是基本的，可以直接购买。 有些是复合材料，可以用固定数量的几种基本工件制作而成。 每当玩家购买基本神器时，它就会添加到他们的库存中。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "implementation"]
categories: ["algorithms"]
codeforces_contest: 69
codeforces_index: "C"
codeforces_contest_name: "Codeforces Beta Round 63 (Div. 2)"
rating: 2000
weight: 69
solve_time_s: 135
verified: true
draft: false
---

[CF 69C - 游戏](https://codeforces.com/problemset/problem/69/C)

 **评级：** 2000
 **标签：** 实施
 **求解时间：** 2m 15s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 每个玩家都拥有多组文物。 有些神器是基本的，可以直接购买。 有些是复合材料，可以用固定数量的几种基本工件制作而成。 

每当玩家购买基本神器时，它就会添加到他们的库存中。 购买之后，就可以立即制作一件复合制品。 制作会消耗所需数量的成分并添加复合工件的一份副本。 该声明保证每次购买后最多有一个可制作的复合工件，因此我们永远不需要在多个配方之间进行选择。 

任务是模拟所有购买并最终打印每个玩家的库存。 只应出现数量为正的文物，并且名称必须按字典顺序打印。 

约束足够小，直接模拟是可行的。 最多有 100 名玩家、最多 50 个食谱、最多 500 次购买。 即使是在每次购买后扫描所有食谱的解决方案也只能执行大约 500 × 50 = 25,000 次食谱检查，这是很小的。 

主要的困难不是性能，而是正确的记账。 制作会移除组件，因此库存的行为必须类似于多重集，而不是简单集。 另一个微妙的点是，复合工件本身可以保留在库存中并与基本工件共存。 

一个常见的错误是忘记在制作后减去成分。 考虑这个输入：```
1 2 1 2
wood
stone
axe: wood 1, stone 1
1 wood
1 stone
```正确的最终库存是：```
1
axe 1
```有缺陷的实现可能会同时输出`wood`,`stone`， 和`axe`，因为它制作了物品但忘记消耗原料。 

另一个容易犯的错误是只在全局范围内检查一次食谱，而不是在相应玩家每次购买后检查食谱。 例子：```
1 1 1 2
gem
crown: gem 2
1 gem
1 gem
```第一次购买没有任何作用。 第二次购买创造`crown`。 正确的输出是：```
1
crown 1
```如果我们在每次购买后不重新检查，则永远不会触发配方。 

还有一个微妙的解析问题。 配方行包含自由文本格式的逗号和冒号：```
sword: iron 2, wood 1
```仅在空格上分割的脆弱解析器会将标点符号附加到名称上，例如`"2,"`或者`"sword:"`。 最安全的方法是首先围绕冒号拆分，然后围绕逗号拆分成分列表。 

## 方法

 蛮力的想法是简单的模拟。 

每次购买时，将购买的神器添加到玩家的库存中。 然后扫描每个食谱并检查玩家是否拥有足够的每种所需成分。 如果某些配方是可制作的，则减去所需的数量并添加复合工件的一份副本。 

这是正确的，因为该声明保证每次购买后最多可以制作一个食谱。 我们永远不会面临相互冲突的选择。 

蛮力方法已经完全符合限制。 让`q`是购买数量，`m`食谱的数量，以及`n`食谱中成分的最大数量。 最坏情况的工作大致是`q × m × n`，这最多是`500 × 50 × 50 = 1,250,000`ingredient checks.

 由于约束很小，因此不需要高级图形处理或依赖性跟踪。 真正的工作在于仔细地进行模拟。 

关键的观察结果是，制作仅取决于单个玩家当前的库存。 购买永远不会在玩家之间交互，因此每个库存都可以独立存储。 一旦我们将每个玩家的库存表示为频率图，配方检查就变成了所需数量与拥有数量的直接比较。 

最佳解决方案本质上是相同的模拟，但使用库存的哈希映射和解析的配方结构干净地实现。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(q × m × n) | O(k × A) | 已接受 |
 | 最佳| O(q × m × n) | O(k × A) | 已接受 |

 这里`A`是不同工件名称的总数。 

## 算法演练

 1. 读取所有基本工件名称。 

我们实际上不需要在模拟过程中区分基本工件和复合工件，但读取名称可以建立工件标识符的范围。 
2. 解析每个复合配方。 

每个配方都包含生成的工件和成分计数对的列表。 将它们存储为：```
result_name -> list of (ingredient, required_count)
```仔细解析很重要，因为逗号和冒号是输入格式的一部分。 
3. 为每个玩家创建一张库存地图。 

各库存店：```
artifact_name -> quantity
```4. 一件一件处理采购。 

对于购买`(player, artifact)`：

 - 增加该玩家购买神器的数量。 
- 扫描所有食谱。 
- 对于每个食谱，检查玩家是否拥有足够的每种成分。 
- 如果食谱是可制作的：

 - 减去所有成分数量。 
- 添加复合工件的一份副本。 
- 停止扫描食谱。 

我们立即停止，因为该声明保证购买后最多可以提供一种食谱。 
5. 所有购买后，打印每个玩家的库存。 

仅应打印计数为正的工件。 输出必须按工件名称按字典顺序排序。 

### 为什么它有效

 不变的是，在处理完每次购买后，每个玩家的库存都完全符合游戏规则。 

当发生购买时，我们首先添加购买的工件。 然后我们检查所有食谱。 如果某些配方是可制作的，我们就会消耗精确所需的成分并添加精确的一种所得工件。 因为该语句保证了新可用配方的唯一性，所以在第一个成功的工艺符合预期的游戏行为后停止。 

由于库存会在每次活动后立即更新，因此下次购买之前的状态始终是正确的。 通过对所有采购的归纳，最终库存是正确的。 

## Python 解决方案```python
import sys
from collections import defaultdict

input = sys.stdin.readline

def solve():
    k, n, m, q = map(int, input().split())

    basic = [input().strip() for _ in range(n)]

    recipes = []

    for _ in range(m):
        line = input().strip()

        result, rest = line.split(": ")

        ingredients = []

        parts = rest.split(", ")

        for part in parts:
            name, cnt = part.rsplit(" ", 1)
            ingredients.append((name, int(cnt)))

        recipes.append((result, ingredients))

    inventories = [defaultdict(int) for _ in range(k)]

    for _ in range(q):
        player, artifact = input().split()
        player = int(player) - 1

        inventories[player][artifact] += 1

        for result, ingredients in recipes:
            ok = True

            for name, need in ingredients:
                if inventories[player][name] < need:
                    ok = False
                    break

            if ok:
                for name, need in ingredients:
                    inventories[player][name] -= need

                inventories[player][result] += 1
                break

    out = []

    for inv in inventories:
        items = []

        for name in sorted(inv.keys()):
            if inv[name] > 0:
                items.append((name, inv[name]))

        out.append(str(len(items)))

        for name, cnt in items:
            out.append(f"{name} {cnt}")

    print("\n".join(out))

solve()
```解决方案直接遵循模拟。 

配方存储为结果名称和成分列表对。 解析使用`split(": ")`首先是因为冒号将手工制品与其需求分开。 然后成分部分被划分为`", "`隔离每个需求。 最后，`rsplit(" ", 1)`将成分名称与其数字数量分开。 使用`rsplit`更安全，因为工件名称是任意字符串。 

每个玩家的库存是`defaultdict(int)`，它会自动将丢失的工件视为数量为零。 

每次购买后，我们都会按输入顺序扫描食谱。 对于每个食谱，我们都会验证每种成分的数量是否可用。 如果是这样，我们减去所需的数量并添加制作的工件。 

一个微妙的实现细节是在制作后立即停止。 该声明保证购买后最多只能提供一种食谱。 继续扫描可能会错误地允许单个事件中的多个飞船。 

打印结果时，我们会过滤掉零计数，因为在制作过程中消耗的成分可能仍保留为字典中的键。 

## 工作示例

 ### 示例 1

 输入：```
2 3 2 5
desolator
refresher
perseverance
vanguard: desolator 1, refresher 1
maelstorm: perseverance 2
1 desolator
2 perseverance
1 refresher
2 desolator
2 perseverance
```### 追踪

 | 步骤| 玩家| 购买| 工艺前库存 | 精心打造| 库存后|
 | --- | --- | --- | --- | --- | --- |
 | 1 | 1 | 荒凉者| 荒凉者=1 | 无 | 荒凉者=1 |
 | 2 | 2 | 坚持不懈| 毅力=1 | 无 | 毅力=1 |
 | 3 | 1 | 复习 | 荒凉=1，复习=1 | 先锋| 先锋=1 |
 | 4 | 2 | 荒凉者| 坚忍=1，荒凉=1 | 无 | 坚忍=1，荒凉=1 |
 | 5 | 2 | 坚持不懈| 坚忍=2，荒凉=1 | 漩涡| maelstorm=1, 荒凉者=1 |

 最终输出：```
1
vanguard 1
2
desolator 1
maelstorm 1
```此示例演示了成分消耗。 制作完成后`vanguard`， 两个都`desolator`和`refresher`从玩家 1 的物品栏中消失。 

### 示例 2

 输入：```
1 2 1 4
wood
stone
axe: wood 2, stone 1
1 wood
1 stone
1 wood
1 wood
```### 追踪

 | 步骤| 购买| 工艺前库存 | 精心打造| 库存后|
 | --- | --- | --- | --- | --- |
 | 1 | 木| 木=1 | 无 | 木=1 |
 | 2 | 石头| 木头=1，石头=1 | 无 | 木头=1，石头=1 |
 | 3 | 木| 木头=2，石头=1 | 斧头| 斧头=1 |
 | 4 | 木| 斧头=1，木头=1 | 无 | 斧头=1，木头=1 |

 最终输出：```
2
axe 1
wood 1
```该跟踪表明，当需求得到满足时，就会立即进行制作，并且只消耗确切所需的数量。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(q × m × n) | 每次购买都会扫描所有食谱和所有食谱成分|
 | 空间| O(k × A) | 每个玩家存储拥有的文物数量|

 最大工作量约为 125 万次成分检查，这对于 Python 在 2 秒限制内来说非常小。 内存使用量也很小，因为不同工件名称的总数最多为 100 个。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io
from collections import defaultdict

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    out_capture = io.StringIO()

    k, n, m, q = map(int, input().split())

    basic = [input().strip() for _ in range(n)]

    recipes = []

    for _ in range(m):
        line = input().strip()

        result, rest = line.split(": ")

        ingredients = []

        for part in rest.split(", "):
            name, cnt = part.rsplit(" ", 1)
            ingredients.append((name, int(cnt)))

        recipes.append((result, ingredients))

    inventories = [defaultdict(int) for _ in range(k)]

    for _ in range(q):
        player, artifact = input().split()
        player = int(player) - 1

        inventories[player][artifact] += 1

        for result, ingredients in recipes:
            ok = True

            for name, need in ingredients:
                if inventories[player][name] < need:
                    ok = False
                    break

            if ok:
                for name, need in ingredients:
                    inventories[player][name] -= need

                inventories[player][result] += 1
                break

    ans = []

    for inv in inventories:
        items = []

        for name in sorted(inv.keys()):
            if inv[name] > 0:
                items.append((name, inv[name]))

        ans.append(str(len(items)))

        for name, cnt in items:
            ans.append(f"{name} {cnt}")

    return "\n".join(ans)

# provided sample
assert run(
"""2 3 2 5
desolator
refresher
perseverance
vanguard: desolator 1, refresher 1
maelstorm: perseverance 2
1 desolator
2 perseverance
1 refresher
2 desolator
2 perseverance
"""
) == (
"""1
vanguard 1
2
desolator 1
maelstorm 1"""
), "sample 1"

# minimum input
assert run(
"""1 1 0 1
a
1 a
"""
) == (
"""1
a 1"""
), "minimum case"

# repeated crafting
assert run(
"""1 1 1 4
gem
crown: gem 2
1 gem
1 gem
1 gem
1 gem
"""
) == (
"""1
crown 2"""
), "multiple crafts over time"

# leftover ingredients
assert run(
"""1 2 1 3
wood
stone
axe: wood 2, stone 1
1 wood
1 stone
1 wood
"""
) == (
"""1
axe 1"""
), "exact consumption"

# independent player inventories
assert run(
"""2 1 1 2
gem
crown: gem 2
1 gem
2 gem
"""
) == (
"""1
gem 1
1
gem 1"""
), "players separated"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 最小输入| 拥有单一神器| 基础初始化|
 | 重复制作|`crown 2`| 购买过程中可以多次制作|
 | 剩余成分| 仅有的`axe 1`| 正确食用食材 |
 | 独立库存| 每个玩家都拥有自己的宝石 | 没有意外的共享状态 |

 ## 边缘情况

 考虑一下手工制作完全消耗所有成分的情况：```
1 2 1 2
wood
stone
axe: wood 1, stone 1
1 wood
1 stone
```第二次购买后，库存变为：```
wood=1, stone=1
```该配方是可制作的，因此两个计数都减少到零并且`axe=1`已添加。 在输出期间，将跳过零计数条目。 最终结果是：```
1
axe 1
```现在考虑延迟制作：```
1 1 1 3
gem
crown: gem 2
1 gem
1 gem
1 gem
```第一次购买后，就不可能制作了。 第二次之后，库存达到`gem=2`， 所以`crown`制作完毕后，两颗宝石都会消失。 第三次购买后，库存变为：```
crown=1, gem=1
```该算法会在每次购买后检查食谱，以便正确处理时间。 

最后，考虑多个玩家：```
2 1 1 2
gem
crown: gem 2
1 gem
2 gem
```玩家 1 拥有一颗宝石，玩家 2 拥有一颗宝石。 也不能手工`crown`，因为库存是独立的。 该算法为每个玩家存储一个单独的字典，因此玩家之间的计数永远不会混合。
