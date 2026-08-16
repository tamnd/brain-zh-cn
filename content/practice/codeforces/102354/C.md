---
title: "CF 102354C - 金钱分享"
description: "我们处理包含两种事件的时间序列。 正值意味着这么多钱被添加到共享帐户中。 负值表示借用请求，其大小是该数字的绝对值。"
date: "2026-08-16T01:42:26+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102354
codeforces_index: "C"
codeforces_contest_name: "2018-2019 Summer Petrozavodsk Camp, Oleksandr Kulkov Contest 2"
rating: 0
weight: 102354
solve_time_s: 163
verified: false
draft: false
---

[CF 102354C - 资金共享](https://codeforces.com/problemset/problem/102354/C)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 43s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们处理包含两种事件的时间序列。 正值意味着这么多钱被添加到共享帐户中。 负值表示借用请求，其大小是该数字的绝对值。 该帐户从零开始，批准的请求会立即从帐户中删除其金额。 仅当帐户当时可以支付时，请求才能获得批准。 

每个事件的输出都有一行。 积极事件始终打印为`resupplied`。 对于请求，我们打印`approved`如果我们将该请求保留在已接受的集合中并且`declined`否则。 目标是最大限度地减少被拒绝的请求总数，而不是借款总额。 

最多可以有 (10^5) 个请求和 (10^5) 个重新提供，因此事件序列可以包含 (2\cdot10^5) 个元素。 在最坏的情况下，二次算法可以执行大约 (4\cdot10^{10}) 次运算，这远远超出了一秒的限制。 我们基本上需要线性或 (O(N\log N)) 工作，其中 (N=n+m)。 金额可以达到 (10^9)，总计可以达到大约 (2\cdot10^{14})，因此运行余额必须使用能够保存比 32 位整数大得多的值的整数类型。 Python 整数已经安全地提供了这一点。 

第一个棘手的情况是请求对于帐户本身来说太大。 例如，```
1 1
-5
+5
```有输出```
declined
resupplied
```第一个请求必须被拒绝，因为稍后到达的资金无法追溯批准它。 如果一个粗心的解决方案首先计算所有补给的总量，然后决定接受哪些请求，则会错误地将第一个请求视为可行。 

另一个微妙的情况是当前请求可以被拒绝，但拒绝较早的请求更好。 考虑，```
3 1
+5
-3
-2
-1
```正确的输出是```
resupplied
approved
approved
approved
```这里前两个请求后的余额为零，因此最后一个请求是不可能的，实际上必须被拒绝。 因此正确的输出是```
resupplied
approved
approved
declined
```一个更具启发性的例子是，```
3 1
+5
-4
-3
+10
```在`-3`，账户只剩下一个单位。 我们可以通过拒绝 4 的早期请求而不是 3 的当前请求来使当前前缀可行。输出可以是```
resupplied
declined
approved
resupplied
```当资金不足时总是拒绝当前请求的贪婪规则会丢失不必要的已接受请求。 

还有一种情况是必须在一个事件中删除多个请求。 例如，```
3 1
+3
-2
-2
-2
```接受前两个请求后，当第三个请求到达时，余额将为负数。 此处删除最大的已接受请求就足够了，但通常可能需要多次删除。 实现必须不断删除已接受的请求，直到余额为非负数。 

## 方法

 直接暴力方法是独立决定每个请求是被批准还是被拒绝。 对于 (n) 个请求，有 (2^n) 个可能的子集。 对于每个子集，我们可以扫描完整的事件序列并检查其接受的请求在每个点是否可行。 这给出了 (O((n+m)2^n)) 次操作。 对于 (n=10^5)，即使 (2^n) 本身也是无望的，因此这种方法仅对理解优化目标有用。 

关键的观察结果是，可行性仅取决于迄今为止所接受的请求总量。 假设到目前为止收到的补给总量为（S），并且前缀中接受的请求总量为（C）。 前缀在 (C\le S) 时准确可行。 

现在从左到右处理请求并尝试接受每一个请求。 如果接受当前请求使总额超过可用资金，则必须从已处理的前缀中删除至少一个已接受的请求。 由于目标对拒绝的请求进行计数，因此只要一项删除可以恢复可行性，我们就希望仅删除一项请求。 在所有已接受的请求中，删除最大的请求可以最大程度地减少消耗的资金，同时也会导致拒绝相同的请求。 

这种贪婪的选择也为未来的请求保留了最多的钱。 假设两个接受的请求的大小为 (a<b)。 如果我们必须拒绝其中之一，则拒绝 (b) 会比拒绝 (a) 留下更多可用资金 (b-a)，而这两种选择都会使被拒绝的请求数量增加 1。 较大的剩余余额永远不会使未来的可行性变得更糟。 

这自然会导致最大堆包含所有当前接受的请求大小。 当请求到达时，尝试接受它并将其插入堆中。 如果余额变为负数，则从堆中删除最大的已接受请求并将该请求标记为已拒绝。 重复此操作，直到余额为非负值。 堆让我们在 (O(\log n)) 中找到最大的已接受请求。 

蛮力方法考虑每个可能接受的子集，因为它无法识别哪些决策是可以互换的。 贪心方法利用了这样一个事实：每个请求在目标中具有相同的成本，即一次拒绝，而它们的货币规模不同。 每当被迫拒绝时，接受的最大请求就是最值得丢弃的请求。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (O((n+m)2^n)) | (O(n+m)) | 太慢了 |
 | 最佳 | (O((n+m)\log n)) | (O(n+m)) | 已接受 |

 ## 算法演练

 1. 读取完整的事件序列并创建根据事件类型初始化的输出数组。 对于积极的事件，答案是立即`resupplied`; 对于请求，首先标记它`approved`因为贪心算法会首先尝试接受每个请求。 
2. 维护`balance`、帐户中当前剩余的金额以及接受请求的最大堆。 蟒蛇的`heapq`是一个最小堆，因此将每个请求量存储为负数。 将事件索引与数量存储在一起，因为稍后的堆删除可能会拒绝较早的请求。 
3. 当发生值为 (x) 的正事件时，将 (x) 添加到`balance`。 不需要从堆中删除任何内容，因为重新供应只会增加可用资金。 
4. 当发生值为（-x）的负面事件时，暂定批准。 减去 (x)`balance`并将 (( -x, index)) 插入堆中。 
5. 如果`balance`现在为负数，重复从堆中删除最大的请求。 对于代表数量 (x) 的堆条目，将 (x) 添加回`balance`并将该请求的输出更改为`approved`到`declined`。 

删除的请求不必是当前请求。 这是贪婪的核心步骤：一次拒绝可以收回尽可能多的资金，为未来的请求留下尽可能多的余额。 
6. 继续，直到处理完所有事件。 每个接受的请求都会保留在堆中，并且每个从堆中删除的请求都会被标记`declined`。 

### 为什么它有效

 处理任何前缀后，堆将准确包含算法当前接受的请求。 不变的是，它们的总成本永远不会超过该前缀中收到的总补给量，因此帐户余额始终为非负数。 

当新请求导致赤字时，每个可行的解决方案都必须拒绝至少一个来自已接受前缀的请求。 该算法拒绝最大的接受请求。 这使用尽可能少的新拒绝数量，因为每当最大的请求恢复可行性时，一次拒绝就足够了。 如果必须删除多个请求，则每次删除都会选择最大的剩余请求，从而最大限度地提高每次拒绝所收回的资金。 

更重要的是，在已处理前缀中接受的请求数量相同的所有可行选择中，保持最大可能的剩余余额至少对于未来来说总是一样好。 拒绝最大的请求恰恰可以达到这一目的。 因此，贪婪状态对于未来请求的可能性永远不会比具有相同拒绝次数的另一种解决方案更少。 通过对事件序列的归纳，最终拒绝的请求数量是最少的。 

## Python 解决方案```python
import sys
import heapq

input = sys.stdin.readline

def solve():
    n, m = map(int, input().split())
    total = n + m

    events = [int(input()) for _ in range(total)]

    answer = []
    heap = []
    balance = 0

    for i, x in enumerate(events):
        if x > 0:
            balance += x
            answer.append("resupplied")
            continue

        amount = -x
        balance -= amount
        heapq.heappush(heap, (-amount, i))
        answer.append("approved")

        while balance < 0:
            neg_amount, idx = heapq.heappop(heap)
            amount_removed = -neg_amount
            balance += amount_removed
            answer[idx] = "declined"

    sys.stdout.write("\n".join(answer))

if __name__ == "__main__":
    solve()
```首先存储输入，以便每个请求都有稳定的事件索引。 该索引是必要的，因为之前接受的请求稍后可能会成为我们决定拒绝的请求。 

对于补给，代码只会增加`balance`和记录`resupplied`。 没有理由修改堆，因为当更多资金到达时，现有已接受的请求仍然被接受。 

对于请求，代码首先将其视为已接受。 这会暂时减去其金额`balance`并将其插入到堆中。 如果结果余额为负，则当前前缀对于所有暂定批准均不可行。 

堆存储`(-amount, index)`。 因为Python的堆返回最小值，所以最负的条目对应最大的请求量。 例如，大小为 3、8 和 5 的请求存储为`-3`,`-8`， 和`-5`， 所以`-8`首先被删除。 

当请求被删除时，代码会将其金额添加回余额并更改`answer[idx]`到`declined`。 这就是为什么输出不能简单地在请求到达时决定。 最初批准的请求稍后可能会成为被拒绝的请求。 

这`while`条件是必要的而不是`if`。 单个大请求可能会产生比所有其他已接受的请求更大的赤字，因此可能必须丢弃多个已接受的请求。 当余额为负时，堆始终至少包含当前请求，因此在恢复可行性之前循环不会用完元素。 

Python 整数处理大约 (2\cdot10^{14}) 的可能平衡而不会溢出。 堆最多包含 (n) 个请求，每个请求最多插入一次，最多删除一次。 

## 工作示例

 ### 示例 1

 输入是```
4 1
+5
-3
-2
-1
-1
```状态的演变如下。 

| 活动 | 行动| 平衡| 堆数量 | 输出变化|
 | ---| ---| ---| ---| ---|
 |`+5`| 补给| 5 |`{}`|`resupplied`|
 |`-3`| 接受 | 2 |`{3}`|`approved`|
 |`-2`| 接受 | 0 |`{3, 2}`|`approved`|
 |`-1`| 接受 | -1 |`{3, 2, 1}`| 去掉3，所以请求2就变成了`declined`|
 |`-1`| 接受 | 0 |`{2, 1, 1}`|`approved`|

 表中的第三个请求是原始请求`-1`在事件索引 3 处。它最初被批准，但堆将大小为 3 的较早请求识别为最好拒绝的请求。 这样就有足够的资金来满足 2 号和 1 号的请求。 

最终输出是```
resupplied
declined
approved
approved
approved
```该跟踪演示了为什么堆必须存储事件索引。 被拒绝的请求不一定是当前正在处理的请求。 

### 构造示例 2

 考虑```
3 2
+5
-4
-3
+2
-2
```踪迹是：

 | 活动 | 行动| 平衡| 堆数量 | 输出变化|
 | ---| ---| ---| ---| ---|
 |`+5`| 补给| 5 |`{}`|`resupplied`|
 |`-4`| 接受 | 1 |`{4}`|`approved`|
 |`-3`| 接受 | -2 |`{4, 3}`| 去掉4，所以请求2就变成了`declined`|
 |`+2`| 补给| 3 |`{3}`|`resupplied`|
 |`-2`| 接受 | 1 |`{3, 2}`|`approved`|

 该算法拒绝较早的大小 4 的请求，并保留大小 3 的请求。这两种选择都将涉及在出现赤字时拒绝一次，但保留较小的请求会留下更多可用资金。 稍后的补给也使最终的请求变得可行。 

输出是```
resupplied
declined
approved
resupplied
approved
```这个例子运用了中心交换论点：当恰好需要一个拒绝时，删除最大的已接受请求始终是剩余序列的最强选择。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O((n+m)\log n)) | 每个请求进入堆一次并可以离开一次，每个堆操作的成本为 (O(\log n))。 |
 | 空间| (O(n+m)) | 事件数组、输出数组和堆一起使用线性内存。 |

 对于最多 (2\cdot10^5) 个事件，堆仅执行线性数量的插入和删除，每个请求数量都是对数。 这完全符合一秒限制的预期复杂性，并且内存使用量是线性的。 

## 测试用例

 以下测试工具使用与提交的解决方案相同的算法，但将其包装在一个函数中，以便可以使用断言检查多个完整的输入。```python
import heapq
import io
import sys

def solve_io(inp: str) -> str:
    data = list(map(int, inp.split()))
    it = iter(data)

    n = next(it)
    m = next(it)
    events = [next(it) for _ in range(n + m)]

    answer = []
    heap = []
    balance = 0

    for i, x in enumerate(events):
        if x > 0:
            balance += x
            answer.append("resupplied")
        else:
            amount = -x
            balance -= amount
            heapq.heappush(heap, (-amount, i))
            answer.append("approved")

            while balance < 0:
                neg_amount, idx = heapq.heappop(heap)
                balance += -neg_amount
                answer[idx] = "declined"

    return "\n".join(answer)

# Provided sample
assert solve_io(
    """4 1
+5
-3
-2
-1
-1
"""
) == """resupplied
declined
approved
approved
approved""", "sample 1"

# Minimum-sized input, request arrives before any money.
assert solve_io(
    """1 1
-5
+5
"""
) == """declined
resupplied""", "initial empty account"

# A previous larger request must be rejected instead of the current request.
assert solve_io(
    """3 1
+5
-4
-3
-1
"""
) == """resupplied
declined
approved
approved""", "reject largest accepted request"

# All request and resupply amounts are equal, with exact balance at every request.
assert solve_io(
    """3 3
+1
-1
+1
-1
+1
-1
"""
) == """resupplied
approved
resupplied
approved
resupplied
approved""", "all equal values"

# Maximum-size structure: 100000 resupplies followed by 100000 requests.
# Every request has exactly one unit available.
max_n = 100000
max_m = 100000
max_input = (
    f"{max_n} {max_m}\n"
    + "+1\n" * max_m
    + "-1\n" * max_n
)
max_output = (
    "resupplied\n" * max_m
    + "approved\n" * max_n
).rstrip()

assert solve_io(max_input) == max_output, "maximum-size input"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 1`， 其次是`-5`,`+5`|`declined`,`resupplied`| 初始余额为零，未来的资金无法满足过去的要求。 |
 |`+5, -4, -3, -1`|`resupplied`,`declined`,`approved`,`approved`| 必须删除较早的较大请求，而不是盲目拒绝当前请求。 |
 | 交替`+1, -1`活动 | 每个请求都是`approved`| 精确的零余额边界和相等的请求大小。 |
 | 100000`+1`100000 次事件`-1`活动 | 每个请求都是`approved`| 最大事件数、大输出和线性堆使用。 |

 ## 边缘情况

 第一个边缘情况是第一次重新供应之前的请求。 为了```
1 1
-5
+5
```堆收到大小为 5 的请求，导致余额 (-5)。 堆立即删除该请求，将余额恢复为零，并将其标记为拒绝。 后来的`+5`之后只会增加余额。 结果是`declined`,`resupplied`，它尊重帐户的时间顺序。 

第二种边缘情况是拒绝当前请求不是最佳选择的缺陷。 为了```
3 1
+5
-4
-3
-1
```后`-4`余额为 1. 接受`-3`给出 (-2) 的平衡。 堆包含大小为 4 和 3 的请求，因此删除大小为 4 的请求。 余额变为 2，大小 3 的请求被接受。 决赛`-1`然后成功，余额为 1。输出为`resupplied`,`declined`,`approved`,`approved`。 

第三种边缘情况是余额变为零的精确边界。 和```
3 1
+5
-2
-3
-1
```第一个请求的余额为 3，第二个请求的余额为 0，第三个请求将使其余额为负数。 暂定接受后，堆包含大小 2、3 和 1，因此最大的请求大小 3 将被删除。 余额恢复为 2，当前 size-1 请求仍获得批准。 输出是`resupplied`,`approved`,`declined`,`approved`。 条件必须是`balance < 0`， 不是`balance <= 0`，因为恰好零钱仍然是可行的。 

第四种边缘情况是一个请求，该请求会产生需要多次删除的赤字。 例如，```
3 1
+3
-2
-2
-2
```在第一个请求之后，余额为 1。在第二个请求之后，余额为 (-1)，因此堆删除了一个 size-2 请求并将余额恢复为 1。当前请求仍然获得批准。 下一个 size-2 请求再次产生赤字，因此另一个 size-2 请求被删除。 因此，该算法会在一个事件中处理多次删除，而不是假设一次拒绝总是足够的。 

最终的边缘情况是最大输入大小。 补给 (10^5)`+1`随后是 (10^5) 个请求`-1`，每个请求都立即可行。 堆增长到 (10^5) 个元素，但每个操作仍然是 (O(\log n))，完整的序列仍然只需要 (O((n+m)\log n)) 时间和 (O(n+m)) 内存。
