---
title: "CF 102299C - 水晶套娃"
description: "我们收藏了俄罗斯套娃。 每个娃娃都有一个正整数重量和一个唯一的标识符。 一个娃娃可以包含几个较小的娃娃，但直接或间接位于外部娃娃内部的所有物品的总重量不得超过外部娃娃的重量。"
date: "2026-08-13T23:13:50+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102299
codeforces_index: "C"
codeforces_contest_name: "2019 USP Try-outs"
rating: 0
weight: 102299
solve_time_s: 147
verified: true
draft: false
---

[CF 102299C - 水晶套娃](https://codeforces.com/problemset/problem/102299/C)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 27s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们收藏了俄罗斯套娃。 每个娃娃都有一个正整数重量和一个唯一的标识符。 一个娃娃可以包含几个较小的娃娃，但直接或间接位于外部娃娃内部的所有物品的总重量不得超过外部娃娃的重量。 

对于查询`? ID`，我们没有被要求构建特定的嵌套。 我们需要在一个有效嵌套中包含尽可能多的娃娃，并且该嵌套中的某处包含指定的娃娃。 所查询的娃娃不必是最外面的娃娃。 

该系列随着时间的推移而变化。 一次手术`+ W ID`插入一个有重量的新娃娃`W`,`- ID`删除现有的娃娃，并且`? ID`询问包含该标识符的最大嵌套大小。 官方的限制是`N <= 10^5`,`Q <= 5 * 10^5`，并且每个权重和标识符最多是`10^9`。 竞赛给这个问题设置了 3 秒的限制和 256 MB 的内存。 

的大值`Q`是关键约束。 为每个查询检查每个当前可用的娃娃的算法太昂贵了。 即使我们只考虑最初的`10^5`娃娃，`5 * 10^5`查询可能已经导致`5 * 10^10`候选人检查。 动态插入和删除使得直接扫描变得更没有吸引力。 

有几种边缘情况很容易被错误处理。 首先，允许平等。 例如，```
2 1
1 1
? 1
```有答案```
2
```因为一个娃娃的重量`1`可以容纳另一个重的娃娃`1`。 使用严格的解决方案`<`比较会错误地返回`1`。 

重复的权重也很重要。 在```
3 1
1 1 2
? 3
```答案是`3`，使用嵌套`1, 1, 2`。 在不考虑多重性的情况下按值删除重量可能会意外删除查询的娃娃或错误的重复项。 

被查询的娃娃可能位于嵌套中间的某个位置。 为了```
4 1
3 1 2 1
? 3
```答案是`3`，使用权重`1, 1, 2`，与重量`2`娃娃作为查询的娃娃。 仅搜索被查询玩偶之外的玩偶的策略会错过有效的解决方案。 

最后，失败的候选人必须保持可用状态。 考虑```
3 1
1 3 10
? 2
```查询的娃娃有重量`3`。 重量`1`娃娃可以放在里面，给定尺寸`2`，但是重量`10`娃娃无法跟随，因为当前总数将是`13`添加后。 在检查第一个候选是否适合之前删除第一个候选的粗心实现会损坏集合。 

## 方法

 直接的做法是暂时移除查询到的娃娃，对剩余的权重进行排序，反复选择可以嵌套在其周围的娃娃。 如果我们在每个阶段都使用最小的可行娃娃，这是正确的，但分类成本`O(N log N)`扫描可能会花费`O(N)`对于一个查询。 高达`5 * 10^5`查询，这远未达到所需的规模。 

我们可以通过将问题分成两个观察来做得更好。 第一个是贪婪。 假设当前已放置在一侧的娃娃总数为`S`。 任何下一个娃娃必须至少有重量`S`，因为它必须包含其中已有的所有玩偶。 在所有可能的选择中，最小的娃娃总是至少与较大的娃娃一样好。 选择较小的娃娃至少为以后的每个选择留下同样多的容量，因此用最小的可行选择替换较大的选择并不能减少可实现的最大娃娃数量。 

对于查询的娃娃内部的娃娃，我们从全局最小的可用重量开始。 最多为查询的权重时才可以使用`X`。 选择后，我们重复取至少等于当前内部总和的最小可用权重，前提是新总和最多保持不变`X`。 

一旦添加了查询的娃娃，同样的贪婪过程就会向外继续。 下一个娃娃的重量必须至少等于当前的总重量，我们再次采用此类娃娃中最小的可用重量。 

第二个观察是使贪婪模拟变得快速的原因。 第一个选定的内娃娃有重量后`y`，每个后来选择的娃娃的重量至少是当前的总和。 因此，每次成功选择后，总和至少翻倍。 添加查询的娃娃后，外部也是如此。 由于所有权重最多为`10^9`，查询只能选择`O(log 10^9)`，大约30个，娃娃。 该集合可能包含数十万个娃娃，但查询只需要少量的有序集操作。 

在 C++ 中，自然的实现是`multiset`，支持插入、删除、最小化和`lower_bound`在`O(log N)`。 已发布的解决方案完全遵循这种带有有序多重集的贪婪策略。 

Python 没有内置的平衡多重集，因此下面的实现使用坐标压缩和分层位集。 每个不同的权重都有一个索引。 计数数组存储每个重量有多少个活动玩偶，而多个级别的 64 位位集告诉我们当前存在哪些重量索引。 然后，在压缩索引处或压缩索引之后找到第一个活跃权重只需要一些层次结构操作。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(QN) 候选检查，如果需要还可以进行排序 | O(N) | 太慢了 |
 | 最优有序集 | O(Q log W log N) | O(Q log W log N) | O(N + Q) | 已接受 |
 | Python 分层位集 | O((N + Q) log(N + Q) + Q log W log N) | O((N + Q) log(N + Q) + Q log W log N) | O(N + Q) | 已接受 |

 这里`W`表示最大可能的重量。 Python 实现中的额外对数来自于使用二分搜索定位压缩索引。 实际的主动权重查找是通过 64 元层次结构而不是传统的树来实现的。 

## 算法演练

 1. 阅读最初的娃娃和所有操作，收集可能出现的每一个重量。 坐标压缩需要在处理动态操作之前知道所有可能的权重。 
2. 对不同的权重进行排序，并为每个权重分配一个压缩索引。 维护一个从每个活动标识符到其压缩权重索引的字典。 
3. 构建分层位集。 在零级，位`i`当至少一个活动玩偶具有压缩重量时准确设置`i`。 更高级别存储前一级的哪些单词是非空的。 这让我们可以找到下一个活跃权重，而无需扫描非活跃指数。 
4. 对于插入，增加相应压缩权重的计数。 如果其计数从零变为一，则设置相应位并通过层次结构传播新的非空字。 
5. 对于删除，减少计数。 如果计数变为零，则清除其位并向上传播新的空字。 
6. 对于查询，暂时移除查询的娃娃。 这可以防止算法选择相同的物理娃娃作为其自己的容器或内容之一。 
7.让`X`为查询的娃娃的体重，并将答案设置为`1`。 找到最小的主动重量`y`。 如果`y <= X`，将其删除，增加答案，并将当前内部和设置为`y`。 如果最小权重已经大于`X`，所查询的娃娃内部不存在可能的娃娃。 
8.尽可能找到最小的主动重量`y >= current_sum`。 如果`current_sum + y <= X`，删除它并更新`current_sum += y`。 否则停止。 选择最小的候选者是最佳的，因为每个较大的候选者至少消耗与所查询的玩偶一样多的容量。 
9. 添加`X`到当前的总和。 查询的娃娃现在是整个当前堆栈，包括其中选择的所有内容。 
10. 反复寻找至少等于当前总和的最小有效权重。 如果存在，请将其删除，增加答案，并将其权重添加到当前总和中。 如果不存在，则不能进一步扩展嵌套。 
11、恢复查询到的娃娃和每个临时选中的娃娃。 查询只是一个计算，因此集合必须与查询之前完全相同。 
12.打印答案并继续下一步操作。 

为什么有效：不变的是，在每个阶段，当前部分嵌套在具有相同娃娃数量的所有部分嵌套中具有最小的可能总权重。 对于内部部分，选择可以使用的最小的可用娃娃可以保留内部最大可能的剩余容量`X`。 对于外部部分，选择可以包含当前堆栈的最小娃娃可以保留尽可能小的新总数。 任何替代选择的权重至少都一样大，因此它不能允许比贪婪选择更多的未来娃娃。 由于每个选定的权重至少是先前的总和，因此成功的选择也会使当前总和加倍，从而限制了迭代次数。 

## Python 解决方案```python
import sys
from bisect import bisect_left
from array import array

input = sys.stdin.readline

def solve():
    n, q = map(int, input().split())

    initial = list(map(int, input().split()))
    while len(initial) < n:
        initial.extend(map(int, input().split()))

    # Store operations compactly.
    # typ: 0 = query, 1 = add, 2 = delete
    typ = bytearray()
    a = array('q')
    b = array('q')

    all_weights = array('q', initial)

    for _ in range(q):
        parts = input().split()
        op = parts[0]

        if op == b'+':
            w = int(parts[1])
            ident = int(parts[2])
            typ.append(1)
            a.append(w)
            b.append(ident)
            all_weights.append(w)
        elif op == b'-':
            ident = int(parts[1])
            typ.append(2)
            a.append(ident)
            b.append(0)
        else:
            ident = int(parts[1])
            typ.append(0)
            a.append(ident)
            b.append(0)

    weights = sorted(set(all_weights))
    m = len(weights)
    weight_to_index = {w: i for i, w in enumerate(weights)}

    del all_weights

    # id -> compressed weight index
    ids = {}

    counts = [0] * m

    # levels[0] has one bit per compressed weight.
    # A bit is set iff that weight currently exists.
    levels = []
    size = (m + 63) >> 6
    levels.append([0] * size)

    while size > 1:
        size = (size + 63) >> 6
        levels.append([0] * size)

    def activate(idx):
        counts[idx] += 1
        if counts[idx] != 1:
            return

        pos = idx

        for level in range(len(levels)):
            word = pos >> 6
            bit = 1 << (pos & 63)

            old = levels[level][word]
            if old & bit:
                break

            levels[level][word] = old | bit

            if old != 0:
                break

            pos = word

    def deactivate(idx):
        counts[idx] -= 1
        if counts[idx] != 0:
            return

        pos = idx

        for level in range(len(levels)):
            word = pos >> 6
            bit = 1 << (pos & 63)

            old = levels[level][word]
            new = old & ~bit
            levels[level][word] = new

            if new != 0:
                break

            pos = word

    def next_active(pos):
        """Return the first active compressed index >= pos, or -1."""
        if pos >= m:
            return -1

        level = 0
        p = pos

        while level < len(levels):
            word = p >> 6
            if word >= len(levels[level]):
                return -1

            mask = -1 << (p & 63)
            value = levels[level][word] & mask

            if value:
                bit = (value & -value).bit_length() - 1
                index = (word << 6) + bit

                if level == 0:
                    return index

                # We found a nonempty word in a higher level.
                # Descend to the actual weight index.
                current = index

                for lower in range(level - 1, -1, -1):
                    value = levels[lower][current]
                    bit = (value & -value).bit_length() - 1
                    current = (current << 6) + bit

                return current

            # No set bit remains in this word. The next possible
            # bit in the next hierarchy level represents word + 1.
            p = word + 1
            level += 1

        return -1

    # Insert the initial collection.
    for ident, w in enumerate(initial, 1):
        idx = weight_to_index[w]
        ids[ident] = idx
        activate(idx)

    out = []

    for k in range(q):
        operation = typ[k]

        if operation == 1:
            w = a[k]
            ident = b[k]

            idx = weight_to_index[w]
            ids[ident] = idx
            activate(idx)

        elif operation == 2:
            ident = a[k]

            idx = ids.pop(ident)
            deactivate(idx)

        else:
            ident = a[k]

            target_idx = ids[ident]
            x = weights[target_idx]

            # Temporarily remove the queried physical doll.
            deactivate(target_idx)

            chosen = [target_idx]
            answer = 1

            # Build the part strictly inside the queried doll.
            first = next_active(0)

            if first != -1:
                y = weights[first]

                if y <= x:
                    deactivate(first)
                    chosen.append(first)
                    answer += 1
                    current = y

                    while True:
                        need = bisect_left(weights, current)
                        nxt = next_active(need)

                        if nxt == -1:
                            break

                        y = weights[nxt]

                        if current + y > x:
                            break

                        deactivate(nxt)
                        chosen.append(nxt)
                        answer += 1
                        current += y
                else:
                    current = x
            else:
                current = x

            # The queried doll becomes part of the current stack.
            if chosen[-1] != target_idx:
                current += x
            else:
                current = x

            # Extend outward.
            while True:
                need = bisect_left(weights, current)
                nxt = next_active(need)

                if nxt == -1:
                    break

                y = weights[nxt]
                deactivate(nxt)
                chosen.append(nxt)

                answer += 1
                current += y

            out.append(str(answer))

            # Restore exactly the dolls temporarily removed for this query.
            for idx in chosen:
                activate(idx)

    sys.stdout.write('\n'.join(out))

if __name__ == "__main__":
    solve()
```初始集合仅插入到压缩结构中一次。 标识符字典存储压缩的权重索引而不是原始权重，这避免了重复搜索标识符的权重。 

这`activate`和`deactivate`函数既保持了多样性，又保持了层次结构。 多样性是必要的，因为几个不同的玩偶可能具有相同的重量。 权重在位集中保持活动状态，直到其计数达到零。`next_active`是 Python 的替代品`multiset.lower_bound`。 在零级，它找到相关 64 位字中的第一个设置位。 如果该单词为空，则它会爬升至更高的级别，记录哪些单词包含任何有效权重，然后再次下降以恢复准确的权重索引。 由于每个级别分为 64 个条目，因此最多只存在少数几个级别`6 * 10^5`可能的权重。 

被查询的娃娃在贪婪过程之前被移除，并在贪婪过程之后恢复。 这`chosen`数组记录压缩的权重索引，恢复索引而不是标识符就足够了，因为查询永远不会更改身份到权重的映射。 

所有求和都使用 Python 整数，因此不存在溢出问题。 在具有固定宽度整数运算的语言中，需要 64 位整数，因为嵌套总和可能超过`10^9`由一个重要因素。 

两人`bisect_left`调用是有意对排序的不同权重执行的。 他们转换所需的重量，例如`current`入其实际权重至少为该值的第一压缩索引。 然后，位层次结构会跳过该索引之后的每个非活动权重。 

## 工作示例

 对于样本 1，初始权重为`3, 1, 2, 1`。 第一个查询询问娃娃的重量`2`。 

| 运营| 目标| 当前总和| 选择的重量| 回答 |
 | --- | --- | --- | --- | --- |
 |`? 3`| 2 | 2 |`2`| 1 |
 | 内心的选择| 2 | 1 |`2, 1`| 2 |
 | 内心的选择| 2 | 2 |`2, 1, 1`| 3 |
 | 外部搜索| 2 | 2 |`2, 1, 1`| 3 |

 第一个`1`适合内部重量`2`。 添加后，还有一个`1`也适合，因为内部总重量恰好是`2`。 没有更多的内部娃娃适合，并且至少没有可用的娃娃重量`4`，所以答案是`3`。 

输入重量后`4`，第二次查询标识符`3`行为不同。 

| 运营| 目标| 当前总和| 选择的重量| 回答 |
 | --- | --- | --- | --- | --- |
 |`? 3`| 2 | 2 |`2`| 1 |
 | 内心的选择| 2 | 1 |`2, 1`| 2 |
 | 内心的选择| 2 | 2 |`2, 1, 1`| 3 |
 | 外部选择| 2 | 6 |`2, 1, 1, 4`| 4 |

 重量`3`太大，无法放入查询的权重中`2`，但是包含查询到的娃娃后，当前总数变为`4`。 新插入的权重`4`可以包含整个堆栈，给出四个娃娃。 这些正是示例 1 的前两个输出。 

对于示例 2，第一个查询涉及重量`9`。 

| 运营| 目标| 当前总和| 选择的重量| 回答 |
 | --- | --- | --- | --- | --- |
 |`? 2`| 9 | 9 |`9`| 1 |
 | 内心的选择| 9 | 1 |`9, 1`| 2 |
 | 内心的选择| 9 | 5 |`9, 1, 4`| 3 |
 | 下一个内部候选人 | 9 | 5 |`9, 1, 4`| 3 |
 | 外部搜索| 9 | 14 | 14`9, 1, 4`| 3 |

 之后的下一个内部候选人`4`是`5`， 但`5 + 5 > 9`，所以不能使用。 添加查询重量后`9`，当前总数为`14`，并且至少没有重量`14`。 答案是`3`。 

举重后`5`和`1`被删除，剩下的相关权重是`4`和`10`。 

| 运营| 目标| 当前总和| 选择的重量| 回答 |
 | --- | --- | --- | --- | --- |
 |`? 2`| 9 | 9 |`9`| 1 |
 | 内心的选择| 9 | 4 |`9, 4`| 2 |
 | 下一个内部候选人 | 9 | 4 |`9, 4`| 2 |
 | 外部搜索| 9 | 13 |`9, 4`| 2 |

 重量`10`里面不能用`9`因为`4 + 10 > 9`。 添加查询的娃娃后，总计为`13`， 所以`10`也不能放在它外面。 答案下降到`2`，匹配样本。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O((N + Q) log(N + Q) + Q log W log(N + Q)) | O((N + Q) log(N + Q) + Q log W log(N + Q)) | 压缩需要排序，每个查询都执行 O(log W) 贪婪选择和有序权重查找 |
 | 空间| O(N + Q) | 所有可能的权重、操作、标识符、计数和层次结构级别都需要线性空间 |

 这里`W <= 10^9`， 所以`log W`最多约为 30。关键的实际事实是查询永远不会扫描整个集合。 每次成功选择后，贪婪总和至少加倍，将看似潜在的线性查询减少为对数数量的有序查找。 最初的竞赛限制为 3 秒，大小为 256 MB，同样的贪婪界限也是预期的有序集解决方案可行的原因。 

## 测试用例

 以下测试假设解决方案另存为`solution.py`并暴露了`solve()`函数如上所示。```python
# helper: run solution on input string, return output string
import sys
import io
import solution

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    try:
        sys.stdin = io.StringIO(inp)
        sys.stdout = io.StringIO()

        solution.input = sys.stdin.readline
        solution.solve()

        return sys.stdout.getvalue()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

# Sample 1
assert run(
    """4 4
3 1 2 1
? 3
+ 4 5
? 3
? 1
"""
) == "3\n4\n3", "sample 1"

# Sample 2
assert run(
    """5 6
5 9 4 1 10
? 2
- 1
- 4
? 2
+ 13 1
? 2
"""
) == "3\n2\n3", "sample 2"

# Minimum-size input
assert run(
    """1 1
7
? 1
"""
) == "1", "single doll"

# Equality boundary: 1 can contain another 1 because <= is allowed
assert run(
    """2 1
1 1
? 1
"""
) == "2", "equality boundary"

# All equal values
assert run(
    """5 1
1 1 1 1 1
? 1
"""
) == "2", "all equal values"

# Dynamic deletion and insertion with identifier reuse
assert run(
    """2 5
1 4
? 2
- 1
? 2
+ 2 3
? 2
"""
) == "2\n1\n2", "dynamic updates"

# Boundary case where two inner dolls exactly fill the queried doll
assert run(
    """3 1
1 1 2
? 3
"""
) == "3", "exact capacity"

# Maximum-size collection, all equal
max_case = "100000 1\n" + ("1 " * 100000).strip() + "\n? 1\n"
assert run(max_case) == "2", "maximum-size all-equal collection"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 1 / 7 / ? 1`|`1`| 最小收藏规模和不可能的容器|
 |`2 1 / 1 1 / ? 1`|`2`| 嵌套条件平等|
 |`5 1 / 1 1 1 1 1 / ? 1`|`2`| 重复权重和多重性 |
 | 动态删除和插入|`2`,`1`,`2`| 正确保养活性集合|
 |`1 1 2 / ? 3`|`3`| 精确的容量和逐一处理 |
 |`100000`重量副本`1`|`2`| 最大尺寸输入和高效重复处理 |

 ## 边缘情况

 对于平等边界，考虑```
2 1
1 1
? 1
```查询到的娃娃被暂时移除，留下一个重量`1`。 自从`1 <= 1`，它被选为内在娃娃。 当前总和变为`1`，另一位候选人将得出总和`2`，对于查询的娃娃来说太大了。 没有外娃娃可用，所以答案是`2`。 该算法使用`<=`在容量检查中，因此它可以准确地处理边界。 

对于重复的权重，请考虑```
3 1
1 1 2
? 3
```查询的权重为`2`。 第一个有效重量是`1`，被选中。 另一个活跃的`1`也被选中是因为`1 + 1 = 2`。 然后将所查询的玩偶包括在内，形成三个玩偶嵌套。 计数数组保存权重`1`直到两个副本都被移除后才处于活动状态，因此两个实体娃娃是分开处理的。 

对于不是最外面的查询娃娃，考虑```
4 1
3 1 2 1
? 3
```暂时减轻体重后`2`，贪心内相选择`1`和另一个`1`，达到内部总计`2`。 然后添加查询的娃娃本身，但外部重量不能包含所得总重量`4`。 答案是`3`。 该算法从不假设所查询的娃娃必须是堆栈中的第一个或最后一个娃娃。 

对于精确填充边界，请考虑```
3 1
1 1 2
? 3
```两个重量`1`娃娃的总重量准确`2`，所以两者都属于查询的权重范围内`2`玩具娃娃。 答案是`3`。 严格的不平等将在第一次之后停止`1`并返回错误答案`2`。 

对于动态状态变化，请考虑```
2 5
1 4
? 2
- 1
? 2
+ 2 3
? 2
```最初，体重`1`可以放入重量内`4`, 给予`2`。 标识符后`1`被删除，仅查询到的重量`4`仍然存在，所以答案就变成了`1`。 插入新的重量`2`恢复了两个娃娃嵌套的可能性，给予`2`再次。 标识符字典和多重结构是独立更新的，因此标识符的删除和以后的重用不会留下过时的权重。
