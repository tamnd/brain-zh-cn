---
title: "CF 102264B - 班级财务主管"
description: "我们有一串按学生证顺序排列的 A 票和 B 票。 代表性集合是该字符串的任何连续间隔。 为了安全起见，Betty 的票数不得超过 Amy 的 K 票。"
date: "2026-08-19T02:58:16+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102264
codeforces_index: "B"
codeforces_contest_name: "2019 Facebook Hacker Cup, Round 1"
rating: 0
weight: 102264
solve_time_s: 260
verified: true
draft: false
---

[CF 102264B - 班级财务主管](https://codeforces.com/problemset/problem/102264/B)

 **评级：** -
 **标签：** -
 **求解时间：** 4m 20s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一串`A`和`B`投票按照学生证顺序排列。 代表性集合是该字符串的任何连续间隔。 为了安全起见，Betty 不得超过`K`投票超过艾米。 同样地，如果我们编码一个`A`作为`+1`和一个`B`作为`-1`，每个连续子数组必须至少有 sum`-K`。 

在选择代表区间之前，我们可能会改变一些`B`投票给`A`投票。 换学生`i`成本`2^i`，所以早期学生的费用呈指数级下降。 任务是选择一组投票发生变化的学生，以便每个间隔都是安全的，同时最小化实际成本。 只有找到最小值后我们才对其取模`1,000,000,007`。 

对于以位置结尾的前缀`i`，令其余额为数量`A`票数减去票数`B`投票。 如果前缀余额是`P_0, P_1, ..., P_N`，则区间的平衡`[l, r]`是`P_r - P_{l-1}`。 当该值小于时，Betty 获胜`-K`，所以我们需要的条件是`P_r >= P_{l-1} - K`对于每一个`l <= r`。 从左到右扫描时，这意味着当前的前缀余额可能永远不会下降超过`K`低于之前看到的最大前缀余额。 

的价值`N`可以达到一百万。 一个`O(N^2)`方法将按以下顺序检查`10^12`最坏情况下的间隔，这是完全不可行的。 该算法需要对每个学生进行固定次数的处理，给出`O(N)`目标。 测试用例的数量也很大，因此 Python 中不必要的对数因子和大型辅助结构很重要。 

有几种边界情况很容易破坏原本看似合理的实现。 和`N = 1`,`K = 0`， 和`V = B`，答案是`2`，因为唯一的代表组是单身学生，否则 Betty 会获胜。 如果粗心的实现只检查长度至少为 2 的间隔，则会返回零。 

和`N = 4`,`K = 0`， 和`V = BAAB`，答案是`18`。 单独翻转学生 1 可以使长间隔安全，但学生 4 仍然是仅 Betty 的代表集，因此也必须翻转。 仅前缀检查可能会默默地错过该单例间隔。 

和`N = 4`,`K = 1`， 和`V = ABBA`，答案是`4`， 不是`8`。 不好的区间是 2 至 3 年级的学生，而且最便宜`B`里面是学生 2。当检测到违规时，总是翻转当前学生的贪婪规则会翻转学生 3 并支付`8`。 

最后，当`K = N`，答案始终为零。 没有一个非空代表集有超过`N`投票给贝蒂，所以贝蒂不能超过艾米超过`K`。 在错误方向上使用严格不等式的实现可能会错误地执行翻转。 

## 方法

 直接的方法是尝试翻转每一个可能的学生组，然后验证每个连续的代表组。 有`2^N`学生可能的选择，甚至检查一个选择也需要检查`O(N^2)`间隔。 对于很小的人来说这已经是无望的了`N`。 

更合理的蛮力可以确定有多少学生被翻转，并选择尽可能便宜的学生。 由于成本是`2^i`，在任何固定数量的学生中，越早使用总是更便宜`B`选民。 然后可以测试第一个是否`m` `B`选民就足够了。 这给出了单调可行性条件并允许二分搜索，但每个可行性检查都会扫描整个字符串，从而导致`O(N log N)`时间。 

违规的结构给出了更强的线性解决方案。 扫描前缀时，保持迄今为止看到的最大有效前缀余额。 如果当前余额至少为该最大值减去`K`，这里结束的每个区间都是安全的。 如果当前余额较小，则存在一个不良区间，其左端点紧接在达到最大前缀余额的位置之后。 

假设该位置是`p`。 对这个坏间隔的任何修复都必须翻转`B`某处`[p + 1, i]`。 由于成本严格随着学生指数的增加而增加，因此最便宜的选择是最左边的未翻转的`B`在那段时间里。 我们恰好翻转了那个学生。 

所选位置单调向右移动。 一次`B`位于当前坏间隔开始之前，它对于以后的违规永远不会有用，因为未来的坏间隔开始不早于当前间隔。 这为我们提供了一个单一的前向指针来查找下一个符合条件的`B`。 

有一个微妙之处。 翻转学生`p`更改每个前缀的有效平衡`p`继续前进`2`，包括已经处理过的前缀。 为了正确维护最大前缀平衡，我们在原始前缀和上保持单调双端队列。 当翻转时`p`，最大原始前缀和`[p, i]`可以从双端队列获得，并且`2`乘以翻转次数。 由于该范围的左端点仅向右移动，因此可以在线性时间内维持双端队列。 

结果是单个从左到右的扫描，每个学生的摊销作业恒定。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 枚举翻转集和间隔 |`O(2^N N^2)`|`O(N)`| 太慢了|
 | 二分查找翻转次数 |`O(N log N)`|`O(N)`| 不必要的缓慢 |
 | 具有前缀最大和单调双端队列的贪婪 |`O(N)`|`O(N)`| 已接受 |

 ## 算法演练

 1. 对每个`A`作为`+1`和每一个`B`作为`-1`，并维持原来的前缀和`P`。 如果是学生`i`已被翻转，每个有效前缀`i`前进的收获`2`。 
2. 维护`max_balance`和`max_pos`，表示严格在当前学生之前的位置之间的最大有效前缀余额以及该最大值出现的最早位置。 最早的位置很有用，因为它提供了尽可能广泛的不良间隔，因此是最便宜的合格位置`B`。 
3. 维护指针`next_b`到最早的`B`尚未选择。 指针仅向前移动。 当违规行为发生后`max_pos`， 任何`B`前`max_pos + 1`无法修复该违规，因此前进指针直到到达第一个`B`在该边界处或之后。 
4. 学生时`i`，计算当前有效余额为`P + 2 * flips`， 在哪里`flips`是迄今为止选定的学生人数。 如果这至少是`max_balance - K`，当前端点不会创建新的违规。 如有必要，请更新最大值。 
5. 如果当前余额低于`max_balance - K`，间隔开始于`max_pos + 1`并结束于`i`很糟糕。 选择最早未翻转的`B`在这个区间内。 这是能够修复新发现的违规行为的最便宜的学生。 
6. 将所选学生的成本以模数添加到答案中`1,000,000,007`。 用于查找的指针`B`Positions 也带有相应的 2 的幂，因此不需要所有幂的数组。 
7. 选择位置后`p`，所有原始前缀总和来自`p`通过`i`增加`2`按有效顺序。 删除之前的双端队列条目`p`，取双端队列中剩余的最大原始前缀和，添加`2 * flips`，并将其与旧的最大值进行比较。 如果新值严格大于，则更新`max_balance`和`max_pos`。 
8. 继续，直到所有`N`学生已经处理完毕。 每个可能的代表性区间都已通过其正确端点进行了考虑，并且每个违规都已由最便宜的合格学生修复。 

### 为什么它有效

 不变的是处理后的位置`i`，每个代表性区间结束于或之前`i`是安全的，所选择的学生是贪心进程针对迄今为止遇到的违规行为做出的最便宜的选择。 当出现新的违规时，其左端点由最大前缀余额确定。 任何有效的解决方案都必须翻转`B`在该间隔内，因为改变外面的学生并不能改变该间隔的投票差异。 在所有符合条件的未翻转中`B`对于选民来说，最左边的成本最小。 选择它不会使未来的解决方案变得更加昂贵，因为它只能改善从其位置或之前开始的间隔，而每晚`B`仍可用于将来的违规行为。 因此，每个贪婪选择都与最优解决方案兼容，并且处理每个端点为所有连续代表集建立了所需的保证。 

## Python 解决方案```python
import sys
from collections import deque

input = sys.stdin.readline

MOD = 1_000_000_007

def solve():
    t = int(input())
    out = []

    for case in range(1, t + 1):
        n, k = map(int, input().split())
        s = input().strip()

        # Monotonic deque of (index, original_prefix_sum).
        # Values are decreasing, and equal values keep the earliest index.
        dq = deque([(0, 0)])

        prefix = 0
        flips = 0

        # Maximum effective prefix sum among processed prefixes.
        max_balance = 0
        max_pos = 0

        # Earliest B which has not been selected yet.
        next_b = 0

        # 2^next_b modulo MOD.
        next_b_cost = 1

        answer = 0

        for i, ch in enumerate(s, 1):
            if ch == 'A':
                prefix += 1
            else:
                prefix -= 1

            # Add current original prefix sum to the monotonic deque.
            while dq and dq[-1][1] < prefix:
                dq.pop()
            dq.append((i, prefix))

            current = prefix + 2 * flips

            if current < max_balance - k:
                # The bad interval starts at max_pos + 1.
                left = max_pos + 1

                # Move to the first unflipped B inside that interval.
                while next_b < left:
                    next_b += 1
                    next_b_cost = next_b_cost * 2 % MOD

                while next_b < i and s[next_b] != 'B':
                    next_b += 1
                    next_b_cost = next_b_cost * 2 % MOD

                # A violation cannot exist without an eligible B.
                # next_b is necessarily <= i and s[next_b] == 'B'.
                p = next_b

                answer = (answer + next_b_cost) % MOD
                flips += 1

                # After flipping p, all prefixes from p onward
                # gain 2. Remove prefixes before p from the range
                # whose maximum needs to be reconsidered.
                while dq and dq[0][0] < p:
                    dq.popleft()

                shifted_max = dq[0][1] + 2 * flips

                # Keep the earliest position on ties.
                if shifted_max > max_balance:
                    max_balance = shifted_max
                    max_pos = dq[0][0]

                # The selected B is no longer available.
                next_b += 1
                next_b_cost = next_b_cost * 2 % MOD

            else:
                if current > max_balance:
                    max_balance = current
                    max_pos = i

        out.append(f"Case #{case}: {answer}")

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```前缀和`prefix`始终引用原始投票字符串。 每个选定学生的效果分别表示为`2 * flips`，因为每个选定的学生都有一个不大于当前扫描位置的索引。 

这`dq`包含按降序排列的原始前缀和。 当新的前缀和到达时，后面的较小值永远不会成为未来范围的最大值，而较大的值仍然保留在前面，因此它们被丢弃。 相等的值不会被丢弃，从而保留最早达到最大值的索引。 这种平局选择很重要，因为较早的最大值给出了可能的最便宜的价格`B`当发生违规行为时。 

这`next_b`指针永远不会向后移动。 它首先跳过当前错误间隔之前的位置，然后跳过`A`职位，直到达到第一个符合条件的人`B`。 选择该学生后，指针将移过该学生。 每个位置最多被该指针传递一次。 

成本变量`next_b_cost`开始于`2^0 = 1`。 每当指针从位置移开时`x`到`x + 1`，成本乘以`2`模数`MOD`。 因此当`next_b`指向学生`i`,`next_b_cost`正是`2^i mod MOD`。 

围绕违规行为的操作顺序很重要。 在检查违规之前将当前原始前缀插入双端队列，因为新选择的学生可能是当前学生，并且翻转后其前缀必须参与新的最大值。 违规本身会根据之前有效前缀的最大值进行检查，由下式表示`max_balance`，在当前前缀被接受为普通的新最大值之前。 

Python 整数不会溢出，但所有成本都会减少模数`MOD`立即地。 前缀余额本身保持在`-N`和`N`，所以它不需要特殊处理。 

## 工作示例

 ### 示例 1

 对于`N = 4`,`K = 0`， 和`V = BAAB`，原始前缀余额为`0, -1, 0, 1, 0`。 第一个学生立即创建了一个坏间隔，因此选择了学生 1。 后来两人之后`A`投票后，学生 4 创建了另一个坏区间，因此学生 4 被选中。 

| 学生| 投票 | 原始前缀 | 翻转| 有效前缀 | 之前的最大值 | 行动|
 | --- | --- | --- | --- | --- | --- | --- |
 | 1 | 乙| -1 | 0 | -1 | 0 | 翻转 1 |
 | 2 | 一个 | 0 | 1 | 2 | 1 | 保留|
 | 3 | 一个 | 1 | 1 | 3 | 2 | 保留|
 | 4 | 乙| 0 | 1 | 2 | 3 | 翻转 4 |

 所选学生为1和4，因此成本为`2^1 + 2^4 = 2 + 16 = 18`。 该示例说明了为什么仅检查长间隔是不够的。 包含学生 4 的单例区间也必须是安全的。 

### 示例 2

 对于`N = 4`,`K = 1`， 和`V = BAAB`，第一个`B`被允许是因为贝蒂仅领先一票。 后来的`B`在门槛下也是无害的，所以没有学生被翻转。 

| 学生| 投票 | 原始前缀 | 翻转| 有效前缀 | 之前的最大值 | 行动|
 | --- | --- | --- | --- | --- | --- | --- |
 | 1 | 乙| -1 | 0 | -1 | 0 | 保留|
 | 2 | 一个 | 0 | 0 | 0 | 0 | 保留|
 | 3 | 一个 | 1 | 0 | 1 | 0 | 保留|
 | 4 | 乙| 0 | 0 | 0 | 1 | 保留|

 在每一点，有效前缀至少为`max_balance - 1`。 因此答案为零。 该迹线还展示了包含边界：Betty 优势完全等于`K`是平局，不是贝蒂赢。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |`O(N)`每次选举| 主扫描，`B`指针，并且每个双端队列条目都只向前移动。 |
 | 空间|`O(N)`| 在最坏的情况下，输入字符串和单调双端队列需要线性存储。 |

 该算法仅对每个学生执行固定摊销次数的操作。 和`N`达到一百万，这是合适的规模，而`O(N log N)`或者`O(N^2)`方法增加了不必要的工作。 

## 测试用例```python
import sys
import io
from collections import deque

MOD = 1_000_000_007

def solve_data(data: str) -> str:
    inp = io.StringIO(data)

    def input():
        return inp.readline

    readline = inp.readline
    t = int(readline())
    out = []

    for case in range(1, t + 1):
        n, k = map(int, readline().split())
        s = readline().strip()

        dq = deque([(0, 0)])
        prefix = 0
        flips = 0
        max_balance = 0
        max_pos = 0

        next_b = 0
        next_b_cost = 1
        answer = 0

        for i, ch in enumerate(s, 1):
            if ch == 'A':
                prefix += 1
            else:
                prefix -= 1

            while dq and dq[-1][1] < prefix:
                dq.pop()
            dq.append((i, prefix))

            current = prefix + 2 * flips

            if current < max_balance - k:
                left = max_pos + 1

                while next_b < left:
                    next_b += 1
                    next_b_cost = next_b_cost * 2 % MOD

                while next_b < i and s[next_b] != 'B':
                    next_b += 1
                    next_b_cost = next_b_cost * 2 % MOD

                answer = (answer + next_b_cost) % MOD
                flips += 1

                while dq and dq[0][0] < next_b:
                    dq.popleft()

                shifted_max = dq[0][1] + 2 * flips

                if shifted_max > max_balance:
                    max_balance = shifted_max
                    max_pos = dq[0][0]

                next_b += 1
                next_b_cost = next_b_cost * 2 % MOD

            elif current > max_balance:
                max_balance = current
                max_pos = i

        out.append(f"Case #{case}: {answer}")

    return "\n".join(out)

# Provided samples
sample = """6
4 0
BAAB
4 1
BAAB
4 1
ABBA
5 2
BBBBB
15 3
ABBBABBBBBABABB
50 4
BBABAABBBBABBBBAABBBBAABBBBBABBBAABABBBBBBABABBAAB
"""

assert solve_data(sample) == """Case #1: 18
Case #2: 0
Case #3: 4
Case #4: 10
Case #5: 324
Case #6: 363067831""", "provided samples"

# Minimum size, Betty must be stopped.
assert solve_data("""1
1 0
B
""") == "Case #1: 2", "single B"

# Minimum size, Amy already wins.
assert solve_data("""1
1 0
A
""") == "Case #1: 0", "single A"

# Threshold equal to N means Betty can never exceed it.
assert solve_data("""1
3 3
BBB
""") == "Case #1: 0", "K = N"

# Boundary case from the statement where the cheapest useful B
# is not the current endpoint.
assert solve_data("""1
4 1
ABBA
""") == "Case #1: 4", "earliest B in bad interval"

# All A, maximum-size input.
n = 1_000_000
assert solve_data(f"1\n{n} 0\n{'A' * n}\n") == "Case #1: 0", "maximum-size all A"

# All B with K = 0 requires flipping every student.
assert solve_data("""1
5 0
BBBBB
""") == "Case #1: 62", "all B with K=0"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 / 1 0 / B`|`Case #1: 2`| 最小尺寸与单身贝蒂间隔|
 |`1 / 1 0 / A`|`Case #1: 0`| 选举已经安全 |
 |`1 / 3 3 / BBB`|`Case #1: 0`| 最大阈值边界 |
 |`1 / 4 1 / ABBA`|`Case #1: 4`| 选择最早符合条件的`B`，不是当前端点 |
 |`N = 1,000,000`， 全部`A`|`Case #1: 0`| 最大输入大小和线性时间行为 |
 |`1 / 5 0 / BBBBB`|`Case #1: 62`| 屡次违规累积权力二人 |

 ## 边缘情况

 对于`N = 1`,`K = 0`， 和`V = B`，初始有效前缀为`-1`，而最大前一个前缀是`0`。 条件`-1 < 0 - 0`检测单例违规。 最早符合资格的`B`是学生 1，其成本为`2`，给出正确的输出`Case #1: 2`。 

为了`N = 4`,`K = 0`， 和`V = BAAB`，立即选择学生 1。 有效前缀变为`1, 2, 3`通过学生 3。在学生 4，有效余额从最大值下降`3`到`2`，低于允许值`3`。 因此，不良间隔从学生 4 开始，并且唯一符合条件的学生`B`是学生 4。其成本是`16`，所以总计为`2 + 16 = 18`。 

为了`N = 4`,`K = 1`， 和`V = ABBA`，学生 1 之后的最大前缀余额为`1`。 学生 2 的余额为`0`，这正是`1 - K`，所以不需要翻转。 在学生 3 处，余额变为`-1`，违反条件。 不良间隔从学生 2 开始，最早的`B`在该区间内的是学生 2。翻转它的成本`4`。 后面的位置是安全的，给出`Case #1: 4`。 

为了`N = 3`,`K = 3`， 和`V = BBB`，最差的可能代表集包含三张 Betty 选票，使 Betty 具有恰好的优势`3`。 因为贝蒂只有在她的优势严格大于`K`，没有检测到违规，答案仍然为零。 

对于最大尺寸的全`A`这种情况下，每个前缀余额都会增加一，因此当前余额始终至少是之前的最大余额。 违规分支永远不会进入，`B`指针从未被使用，并且在一次线性扫描后答案保持为零。 这会在不引入任何特殊情况行为的情况下运用最大可能的输入。
