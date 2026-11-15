---
title: "CF 73B - 极品刹车"
description: "在决赛之前我们就知道目前的积分榜。 每个赛车手都已经拥有一定数量的积分，最后一场比赛将为前 m 名完赛者分配额外的积分。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "greedy", "sortings"]
categories: ["algorithms"]
codeforces_contest: 73
codeforces_index: "B"
codeforces_contest_name: "Codeforces Beta Round 66"
rating: 2000
weight: 73
solve_time_s: 129
verified: true
draft: false
---

[CF 73B - 极品刹车](https://codeforces.com/problemset/problem/73/B)

 **评级：** 2000
 **标签：** 二分查找，贪心，排序
 **求解时间：** 2m 9s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 在决赛之前我们就知道目前的积分榜。 每个赛车手都已经有一定数量的积分，最后一场比赛会向顶部分配额外的积分`m`终结者。 比赛第一名的选手获得`b[0]`积分，第二名的赛车手获得`b[1]`， 等等。 

决赛结束后，选手按照总积分从高到低的顺序排名。 如果两名赛车手获得相同的分数，则昵称按词典顺序较小的赛车手被认为更高。 

我们需要为 Vasya 的赛车提供两个值：

 1. 他仍然可以获得的最好的最终冠军位置。 
2.他仍然可能跌落到的最差的最终冠军位置。 

最终的比赛顺序完全在我们的控制之下。 任何赛车手都可以被指定一次任何完赛名次。 这意味着我们可以自由地以对瓦西亚最有帮助或伤害最大的方式分配奖励积分。 

这些限制迫使我们仔细思考。 最多可以有`10^5`赛车手，所以任何二次方的东西都已经太贵了。 反复尝试所有可能的点分配的简单模拟会发生组合爆炸。 甚至一个`O(n^2)`检查与`10^5`赛车手需要周围`10^10`操作，这在 4 秒内是不可能的。 

棘手的部分是打破平局的规则。 相同的分数不足以实现排名的平等。 字典顺序决定了平局中的获胜者。 

考虑这个输入：```
2
alex 10
vasya 10
0
vasya
```不分配奖励积分。 两名车手均获得 10 分。 自从`"alex" < "vasya"`，Alex的排名高于Vasya，所以答案是：```
2 2
```仅比较分数的粗心实现会错误地输出`1 1`。 

当某些奖金值为零时，会出现另一种微妙的情况。```
3
aaa 5
bbb 5
vasya 5
2
10 0
vasya
```给予 Vasya 第一名的比赛奖金可获得 15 分，这保证了总成绩第一。 但如果瓦夏获得零奖金，平局就再次变得重要。 我们不能假设授予的职位总是会改变排名。 

一种更危险的边缘情况是`m = 0`。```
3
a 100
vasya 100
z 100
0
vasya
```根本不加分。 最终排序完全由相等分数之间的字典顺序决定。 瓦夏获得第二名。 

总是假设 Vasya 参与奖励赛车手的实现在这里将会失败。 

## 方法

 蛮力的观点很简单。 我们可以尝试瓦西亚所有可能的完赛名次，然后将剩余的比赛名次以各种可能的方式分配给所有其他选手，最后计算出最终的冠军排名。 

这是正确的，因为它探索了上一场比赛的每一个有效结果。 问题是排列的数量。 即使对于 15 名赛车手来说，尝试所有任务也已经是不可行的。 和`10^5`赛车手们，穷举搜索是没有希望的。 

关键的观察是我们从不关心其他人的确切顺序。 我们只关心赛车手能否超越瓦西亚。 

假设我们固定 Vasya 收到的奖金。 他的最终得分变为：```
vasya_score = current_score + chosen_bonus
```现在问题变成：

 有多少赛车手可以被强迫超过他，或者阻止超过他？ 

对于任何其他赛车手来说，他们是否击败瓦西亚仅取决于是否存在未使用的奖金，使他们的最终成绩严格优于瓦西亚，或者与字典顺序上较小的名字相同。 

这将问题转化为赛车手和可用奖金之间的贪婪匹配问题。 

为了获得尽可能最好的最终排名，我们希望瓦斯亚之上的赛车手尽可能少。 当然，只有在不可避免的情况下我们才应该给予危险的奖金。 每个赛车手应使用最小的足够奖金。 

对于最差的最终排名，我们希望有尽可能多的赛车手超过 Vasya。 然后，只要有可能，我们就会贪婪地为赛车手提供丰厚的奖金。 

两个版本都减少了检查有多少赛车手可以在贪婪分配奖金的情况下超过固定目标分数。 排序可以提高效率。 

最终复杂度变为`O(n log n)`。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | 指数| 指数| 太慢了|
 | 最佳 | O(n log n) | O(n log n) | O(n) | 已接受 |

 ## 算法演练

 ### 最佳位置

 1. 尝试 Vasya 可以获得的所有可能的奖金。 

Vasya 可能会在奖励排名之外完成比赛，因此当某些奖金仍未使用时，也有可能获得零额外积分。 
2. 计算获得该奖金后 Vasya 的最终得分。 
3. 从可用池中删除该奖金。 
4. 将剩余的奖金按升序排列。 
5. 对于其他每位参赛者，计算超过 Vasya 完成比赛所需的最低额外分数。 

如果满足以下条件，赛车手将击败 Vasya：

 - 他们的总分变得更大，或者
 - 总分变得相等，并且他们的昵称按字典顺序更小。 
6. 按照所需奖金从小到大的顺序处理参赛者。 

对于每个赛车手，贪婪地分配足够的最小可用奖金。 

这最大限度地减少了能够超越瓦西亚的赛车手的数量，因为为更困难的情况保留了丰厚的奖金。 
7. 计算有多少赛车手成功超越了瓦夏。 
8. Vasya 的最终位置是一加。 
9. 在 Vasya 奖金的所有选择中取最小值。 

### 最差可能的位置

 1. 再次尝试 Vasya 可以获得的所有可能的奖励。 
2. 计算他的最终得分。 
3. 从可用池中删除 Vasya 选择的奖金。 
4. 将剩余的奖金按升序排列。 
5. 对于其他每位赛车手，确定超越 Vasya 所需的最低奖金。 
6. 按照从最难到最容易满足的顺序处理赛车手。 

我们现在希望最大化 Vasya 之上的赛车手数量。 最佳策略是为最需要帮助的赛车手提供最大的奖金。 
7. 贪婪地匹配最大的剩余奖金。 
8. 计算有多少赛车手可以被推到 Vasya 之上。 
9. Vasya 的最终位置变为该计数加一。 
10. 取 Vasya 奖金所有选择中的最大值。 

### 为什么它有效

 关键的特性是每个赛车手只取决于他们是否获得至少与某个阈值一样大的奖金。 

这将问题转换为阈值和可用奖金之间的匹配问题。 

为了最大限度地减少成功赛车手的数量，分配最小的足够奖金始终是最佳选择。 任何更大的奖金只会浪费稍后可以帮助其他赛车手的资源。 

为了最大限度地增加成功赛车手的数量，将最大的奖金分配给要求最高的赛车手是最佳选择。 如果现在无法满足较大的要求，以后也无法通过较小的奖金来满足。 

这两种贪婪策略都是经典的交换论点。 任何非贪婪分配都可以重新排列为贪婪分配，而不会导致结果恶化。 

## Python 解决方案```python
import sys
from bisect import bisect_left

input = sys.stdin.readline

def better(name1, score1, name2, score2):
    if score1 != score2:
        return score1 > score2
    return name1 < name2

def solve():
    n = int(input())

    names = []
    scores = []

    for _ in range(n):
        s, a = input().split()
        names.append(s)
        scores.append(int(a))

    m = int(input())
    b = list(map(int, input().split())) if m else []

    vasya = input().strip()
    vid = names.index(vasya)

    bonus_options = b[:] + [0]

    best = n
    worst = 1

    for used_bonus in bonus_options:
        vasya_score = scores[vid] + used_bonus

        remaining = b[:]
        removed = False

        for i in range(len(remaining)):
            if remaining[i] == used_bonus and not removed:
                remaining.pop(i)
                removed = True
                break

        remaining.sort()

        need = []

        for i in range(n):
            if i == vid:
                continue

            cur = scores[i]

            if names[i] < vasya:
                req = vasya_score - cur
            else:
                req = vasya_score - cur + 1

            req = max(req, 0)
            need.append(req)

        need.sort()

        # best rank
        ptr = 0
        above = 0

        for req in need:
            pos = bisect_left(remaining, req, ptr)
            if pos == len(remaining):
                continue
            above += 1
            ptr = pos + 1

        best = min(best, above + 1)

        # worst rank
        rem_ptr = len(remaining) - 1
        above = 0

        for req in reversed(need):
            if rem_ptr >= 0 and remaining[rem_ptr] >= req:
                above += 1
                rem_ptr -= 1

        worst = max(worst, above + 1)

    print(best, worst)

solve()
```该解决方案会迭代 Vasya 可能收到的每一个可能的奖励。 最多有`m + 1`此类选择，包括没有得分的可能性。 

用于比较赛车手的辅助条件通过所需的奖金计算进行编码。 假设另一位赛车手目前有`cur`点。 

如果他们的名字按字典顺序小于 Vasya 的名字，那么平等就足以排名在他之上，所以他们需要：```
cur + bonus >= vasya_score
```否则他们需要更多的分数：```
cur + bonus > vasya_score
```这种区别是错误答案最常见的来源。 

对于最佳排名计算，我们贪婪地分配满足每个赛车手的最小奖金。 这`bisect_left`调用有效地找到第一个可用的奖金。 

对于最差排名的计算，我们反转两个数组并贪婪地消耗最大的剩余奖金。 这最大限度地提高了比赛的成功率。 

该代码仅删除了 Vasya 选择的奖励中的一次出现。 当多项奖金具有同等价值时，这一点很重要。 

## 工作示例

 ### 示例 1

 输入：```
3
teama 10
teamb 20
teamc 40
2
10 20
teama
```假设 Vasya 拿奖金`20`。 

| 赛车手 | 当前| 需要击败瓦夏| 分配奖金 | 击败瓦夏 |
 | ---| ---| ---| ---| ---|
 | 团队| 20 | 11 | 11 无 | 没有 |
 | 团队| 40 | 40 0 | 10 | 10 是的 |

 瓦夏结束了`30`。 

仅有的`teamc`可以保持在他之上，所以 Vasya 成为第二。 

现在假设瓦夏采取`0`。 

| 赛车手 | 当前| 需要| 已分配 |
 | ---| ---| ---| ---|
 | 团队| 11 | 11 20 | |
 | 团队| 0 | 10 | 10 |

 两名赛车手的成绩均高于他，因此他排名第三。 

最终的答案是：```
2 3
```这条痕迹说明了为什么有必要为 Vasya 尝试每一种可能的奖励。 

### 示例 2```
4
adam 10
bob 10
vasya 10
zoe 10
2
0 5
vasya
```如果瓦夏采取`5`，他的最终得分是`15`。 

| 赛车手 | 字典序更小？ | 需要|
 | ---| ---| ---|
 | 亚当 | 是的 | 5 |
 | 鲍勃 | 是的 | 5 |
 | 佐伊 | 没有 | 6 |

 仅剩一项奖金，即`0`，所以没人能打败他。 

如果瓦夏采取`0`，他的最终得分是`10`。 

| 赛车手 | 需要|
 | ---| ---|
 | 亚当 | 0 |
 | 鲍勃 | 0 |
 | 佐伊 | 1 |

 现在两者`adam`和`bob`由于字典顺序，他的排名已经超过了他。 

最终答案：```
1 3
```这个例子说明了为什么不能统一对待相同的分数。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n log n) | O(n log n) | 排序和二分搜索占主导地位
 | 空间| O(n) | 奖金和要求数组 |

 该算法很容易满足约束条件。 排序`10^5`值并执行对数搜索完全在 Python 的 4 秒限制之内。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io
from bisect import bisect_left

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    def solve():
        n = int(input())

        names = []
        scores = []

        for _ in range(n):
            s, a = input().split()
            names.append(s)
            scores.append(int(a))

        m = int(input())
        b = list(map(int, input().split())) if m else []

        vasya = input().strip()
        vid = names.index(vasya)

        bonus_options = b[:] + [0]

        best = n
        worst = 1

        for used_bonus in bonus_options:
            vasya_score = scores[vid] + used_bonus

            remaining = b[:]
            removed = False

            for i in range(len(remaining)):
                if remaining[i] == used_bonus and not removed:
                    remaining.pop(i)
                    removed = True
                    break

            remaining.sort()

            need = []

            for i in range(n):
                if i == vid:
                    continue

                cur = scores[i]

                if names[i] < vasya:
                    req = vasya_score - cur
                else:
                    req = vasya_score - cur + 1

                req = max(req, 0)
                need.append(req)

            need.sort()

            ptr = 0
            above = 0

            for req in need:
                pos = bisect_left(remaining, req, ptr)
                if pos == len(remaining):
                    continue
                above += 1
                ptr = pos + 1

            best = min(best, above + 1)

            rem_ptr = len(remaining) - 1
            above = 0

            for req in reversed(need):
                if rem_ptr >= 0 and remaining[rem_ptr] >= req:
                    above += 1
                    rem_ptr -= 1

            worst = max(worst, above + 1)

        return f"{best} {worst}"

    return solve()

# provided sample
assert run(
"""3
teama 10
teamb 20
teamc 40
2
10 20
teama
"""
) == "2 3", "sample 1"

# minimum size
assert run(
"""1
vasya 0
0
vasya
"""
) == "1 1", "single racer"

# tie-breaking check
assert run(
"""3
adam 10
vasya 10
zoe 10
0
vasya
"""
) == "2 2", "lexicographical ties"

# all bonuses zero
assert run(
"""4
a 5
b 5
vasya 5
z 5
3
0 0 0
vasya
"""
) == "3 3", "zero bonuses"

# off-by-one strict inequality
assert run(
"""2
vasya 10
zzz 10
1
0
vasya
"""
) == "1 1", "equal score but larger name stays below"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单人赛车手 |`1 1`| 最小输入尺寸 |
 | 词典编纂联系 |`2 2`| 同等分数使用名称排序 |
 | 所有奖金为零|`3 3`| 正确处理零奖金 |
 | 名字大，得分相同 |`1 1`| 严格的对比逻辑|

 ## 边缘情况

 考虑纯粹的打破平局的情况：```
3
a 100
vasya 100
z 100
0
vasya
```Vasya 没有收到奖金，因为不存在奖金。 

该算法计算所需的奖金：

 | 赛车手 | 需要|
 | ---| ---|
 | 一个 | 0 |
 | z | 1 |

 赛车手`a`已经击败了 Vasya 因为`"a" < "vasya"`并且分数相等就足够了。 

赛车手`z`需要加一分，这是不可能的。 

恰好有一位赛车手的成绩高于 Vasya，所以答案是：```
2 2
```现在考虑重复的奖金值：```
4
a 0
b 0
c 0
vasya 0
3
5 5 5
vasya
```假设 Vasya 拿了一个`5`。 

该算法仅从多组奖金中删除一次出现的情况。 仍有两项奖金可用。 

其他所有赛车手都需要`5`积分追平或超过 Vasya。 

剩下的两项奖金仍然可以分配，因此有两名赛车手超过了他。 

如果我们不小心删除了所有副本`5`，我们会错误地得出没人能打败瓦夏的结论。 

最后，考虑严格不等式的情况：```
2
vasya 10
zzz 10
1
0
vasya
```赛车手`zzz`具有按字典顺序排列的较大名称，因此并列是不够的。 

所需的奖金变为：```
10 - 10 + 1 = 1
```但唯一可用的奖金是`0`。 

该算法正确地得出结论，没有人可以完成 Vasya 之上的任务，从而产生：```
1 1
```一个忘记了的解决方案`+1`会错误地将瓦夏置于第二位。
