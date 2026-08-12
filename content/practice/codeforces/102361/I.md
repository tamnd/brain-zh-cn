---
title: "CF 102361I - 祈求者"
description: "调用者维护最多三个元素的序列。 按 Q、W 或 E 将该元素附加到序列中。 如果已经存在三个元素，则最旧的元素首先消失。"
date: "2026-08-13T00:13:57+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102361
codeforces_index: "I"
codeforces_contest_name: "2019 China Collegiate Programming Contest Qinhuangdao Onsite"
rating: 0
weight: 102361
solve_time_s: 75
verified: true
draft: false
---

[CF 102361I - 调用者](https://codeforces.com/problemset/problem/102361/I)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 15s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 调用者维护最多三个元素的序列。 紧迫`Q`,`W`， 或者`E`将该元素附加到序列中。 如果已经存在三个元素，则最旧的元素首先消失。 特殊技能仅由当前三个元素的多重集决定，因此顺序对于将来的更新很重要，但在决定当前可用的特殊技能时并不重要。 

输入字符串描述了必须按顺序调用的特殊技能。 在字符串的每个字符之前，Invoker 必须有相应的三元素多重集，然后按`R`。 紧迫`R`花费一项技能并且不会改变元素的当前有序序列。 目标是尽量减少基本技能推举的总数以及`R`按下。 

可能的元素只有三种，并且库存最多包含其中的三种。 这使得完整的状态空间很小。 一旦库存包含三个元素，则只有 (3^3=27) 种可能的有序状态。 最初的空状态又添加了一个状态。 输入长度可以达到（10^5），因此具有取决于可能状态数量的因子的算法很容易足够快，而对所有可能历史的搜索是指数级的并且无法处理最大输入。 

错误的主要来源是特殊技能忽略了顺序，而未来的替代技能则不会。 例如，构建后`X`，元素可以是`QWW`，并在构建后`V`他们只需要包含`QQW`。 开始于`QWW`, 附加`Q`给出`WWQ`，这仍然是`X`; 追加另一个`Q`给出`WQQ`，即`V`。 因此`XV`需要（4+2+1=7）个技能。 在每次操作后对库存进行排序的解决方案会丢失按时间顺序排列的信息，并且可能错误地声称需要更少的基本印刷机。 

另一个极端情况是重复一项特殊技能。 用于输入`YY`，第一个`Y`需要`QQQ`其次是`R`，而第二个`Y`只需要另一个`R`，因为调用后元素仍然存在。 答案是`5`。 从头开始重建所有请求的技能的粗心实现将会返回`8`。 

初始状态也很特殊。 用于输入`B`，开头没有元素，因此必须在第一次调用之前创建所有三个元素。 答案是`4`。 将初始状态视为任意完整库存会低估成本。 

## 方法

 直接暴力方法可以尝试两次调用之间基本技能的所有可能序列。 由于每个特殊技能都需要三个元素，因此没有理由在下一个技能之前按下三个以上的基本技能`R`：经过三台新印刷机后，整个旧库存已被丢弃，并且可以构建任何所需的三元素多重集。 然而，对整个历史进行完全未经修剪的搜索会考虑每一个可能的基本技能字符串。 对于 (n) 项请求的技能，每次调用之前允许最多按 3 次基本按键的搜索

 [
 \sum_{k=0}^{3n}3^k=\frac{3^{3n+1}-1}{2}
 ]

 最坏情况下可能的基本技能前缀。 对于 (n=100000) 来说，这是一个天文数字。 

暴力推理是正确的，因为每个合法序列都可以通过其基本的按下和调用来表示，并且枚举这些序列最终将找到最小值。 它的问题在于，它反复探索具有相同当前库存和相同未来可能性的历史。 

关键的观察是，一旦我们知道当前的订购库存，就可以丢弃过去的库存。 仅有 27 个完整订购库存。 对于每一对这样的状态，我们可以计算将一种状态转换为另一种状态所需的最小基本按压次数。 每个基本的按下只是一个微小有向图中的一条边：`Q`,`W`， 或者`E`，并在必要时删除最旧的元素。 

这将问题转化为仅针对 27 个状态的动态规划。 对于每个请求的特殊技能，我们枚举其三个元素的所有有序排列。 这样的状态最多有六个。 如果之前订购的库存是`state`这些排列之一是`target`，过渡成本是预先计算的基本按下次数`state`到`target`，加一为`R`。 

可以使用 BFS 从每个状态计算距离表。 如果包括空状态，则该图只有 28 个状态，并且每个状态都有 3 个出边。 预处理实际上是恒定时间。 主循环对每个字符最多执行 (27\times6) 次转换，从而给出输入长度的线性复杂度。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(3^{3n})) | (O(n)) for a search path | 太慢了 |
 | 最佳| (O(n)) 具有小常数 | (O(1)) | (O(1)) | 已接受 |

 ## 算法演练

 1. 将每个订购的库存表示为 0 到 3 个字符的元组。 空元组代表初始状态。 对于完整的库存，`(Q, W, E)`和`(E, W, Q)`是不同的状态，因为他们对下一个基本技能的反应不同。 
2. 通过从空状态开始并重复追加每个状态来生成所有可达状态`Q`,`W`， 和`E`。 当附加第四个元素时，仅保留最新的三个。 总共只有 28 个状态，所以这可以用一个小的 BFS 来完成。 
3. 建立所有状态之间的最短距离表。 一个 BFS 从每个状态探索三种可能的基本技能。 由此产生的距离告诉我们达到任何其他状态所需的基本按下次数。 
4. 将每个特殊技能角色映射到其所需的多重集。 例如，`X`对应于`QWW`,`B`对应于`QWE`， 和`T`对应于`EEE`。 
5. 对于每项特殊技能，生成其三个必需元素的所有不同排列。 该顺序不是特殊技能的一部分，因此每个排列都是有效的最终库存。 最多产生六个状态。 
6. 维护`dp[state]`，调用所有已处理的特殊技能并以精确排序的库存结束后已使用的技能的最小数量`state`。 最初只能以零成本达到空状态。 
7. 对于下一个请求的特殊技能，考虑该特殊技能的每个当前可到达的状态和每个有效的有序目标状态。 使用预先计算的最短距离在它们之间移动，然后添加一个以按下`R`。 保留每个目标状态的最小值。 
8. 用新的 DP 数组替换旧的 DP 数组并处理下一个字符。 在最后一个字符之后，答案是所有完整状态的最小 DP 值，因为最后一次调用可以以所请求的多重集的任何顺序完成。 

### 为什么它有效

 不变的是`dp[state]`正是完成输入的已处理前缀并具有的最小成本`state`作为上次调用后立即订购的库存。 对于下一个特殊技能，每个法律策略必须首先从其当前状态移动到某个有序库存，其多重集代表所请求的技能。 BFS 距离给出了该运动的最小可能的基本按下次数，并且所需的调用正好添加了一个操作。 由于考虑了每个有效的目标顺序，因此转换包括调用下一个技能的所有可能的合法方式。 因此，对所有先前状态取最小值可以保持不变性。 通过对输入字符串进行归纳，最终的最小值就是全局最优答案。 

## Python 解决方案```python
import sys
from collections import deque
from itertools import permutations

input = sys.stdin.readline

ELEMENTS = "QWE"

SPECIAL = {
    "Y": "QQQ",
    "V": "QQW",
    "G": "QQE",
    "C": "WWW",
    "X": "QWW",
    "Z": "WWE",
    "T": "EEE",
    "F": "QEE",
    "D": "WEE",
    "B": "QWE",
}

def build_states():
    states = [()]
    index = {(): 0}
    q = deque([()])

    while q:
        state = q.popleft()

        for ch in ELEMENTS:
            nxt = state + (ch,)
            if len(nxt) > 3:
                nxt = nxt[-3:]

            if nxt not in index:
                index[nxt] = len(states)
                states.append(nxt)
                q.append(nxt)

    return states, index

def build_dist(states, index):
    m = len(states)
    dist = [[10**9] * m for _ in range(m)]

    for start in range(m):
        dist[start][start] = 0
        q = deque([start])

        while q:
            u = q.popleft()
            state = states[u]

            for ch in ELEMENTS:
                nxt = state + (ch,)
                if len(nxt) > 3:
                    nxt = nxt[-3:]

                v = index[nxt]
                if dist[start][v] == 10**9:
                    dist[start][v] = dist[start][u] + 1
                    q.append(v)

    return dist

def solve_string(s):
    states, index = build_states()
    dist = build_dist(states, index)

    m = len(states)
    inf = 10**9

    dp = [inf] * m
    dp[index[()]] = 0

    targets = {}

    for skill, elements in SPECIAL.items():
        target_states = set()

        for p in permutations(elements):
            target_states.add(index[p])

        targets[skill] = tuple(target_states)

    for skill in s:
        ndp = [inf] * m

        for u in range(m):
            if dp[u] == inf:
                continue

            for v in targets[skill]:
                cost = dp[u] + dist[u][v] + 1
                if cost < ndp[v]:
                    ndp[v] = cost

        dp = ndp

    return str(min(dp))

def main():
    s = input().strip()
    print(solve_string(s))

if __name__ == "__main__":
    main()
```这`SPECIAL`字典存储每项特殊技能所需的三个元素的一个代表性排序。 字典值稍后被视为多重集，因此其特定顺序没有语义意义。`build_states`构建通过基本技能可以达到的每一个状态。 元组表示很有用，因为元组是可散列的并且保留时间顺序。 当元组增长超过三个元素时，`nxt[-3:]`准确地实现了 FIFO 替换规则。`build_dist`从每个状态运行 BFS。 每条边的成本都是 1，因为基本技能压力机通过一次操作就改变了库存。 因此，BFS 是正确的最短路径算法。 自动包含空状态，它处理第一个请求的特殊技能，而无需单独的特殊情况。 

对于每一项特殊技能，`permutations`生成所有可能的订单。 一个`set`删除重复的技能，例如`Y`，其中所有三个排列都是相同的。 这是一个微妙但有用的实现细节，因为`QQQ`应该只产生一种目标状态，而不是重复处理相同的转换。 

DP更新增加了`dist[u][v]`所需的基本技能，然后恰好添加一项`R`。 该调用不会修改库存，因此`v`保持转换后的状态。 仅在评估当前角色的所有转换后，才会替换旧的 DP 数组，从而防止在单次迭代期间多次调用一项请求的技能。 

对于最大输入，所有成本最多为数十万，因此 Python 整数不存在溢出问题。 距离表仅在初始化时使用较大的哨兵值，尽管一旦库存已满，每个状态都可以在最多三个基本按键内从每个其他状态到达。 

## 工作示例

 提供的样本是`XDTBVV`。 下表显示了每个请求的技能后当前的最佳 DP 状态。 多个状态可以具有相同的成本，但此处仅将与最终延续相关的最小成本状态显示为一条最佳路径。 

| 要求的技能 | 添加基本​​印刷机 | 订购后的库存`R`| 总成本|
 | --- | --- | --- | --- |
 |`X`|`QWW`|`QWW`| 4 |
 |`D`|`EE`|`WEE`| 7 |
 |`T`|`E`|`EEE`| 9 |
 |`B`|`WQ`|`EWQ`| 12 | 12
 |`V`|`Q`|`WQQ`| 14 | 14
 |`V`| 无 |`WQQ`| 15 | 15

 操作顺序是`QWWREERERWQRQRR`。 第四次转型的关键是目标`B`只需要多重集`QWE`。 开始于`EEE`, 附加`W`给出`EEW`，然后附加`Q`给出`EWQ`，其多重集恰好是`QWE`。 决赛`V`只需要一张`R`因为上次调用后的库存已经是`WQQ`，这代表`QQW`。 

对于第二个例子，考虑构建的输入`XV`。 

| 要求的技能 | 添加基本​​印刷机 | 订购后的库存`R`| 总成本|
 | --- | --- | --- | --- |
 |`X`|`QWW`|`QWW`| 4 |
 |`V`|`QQ`|`WQQ`| 7 |

 创建后`QWW`, 额外一个`Q`产生`WWQ`，仍然代表`X`。 一秒钟`Q`产生`WQQ`，这代表`V`。 因此，两次调用之间需要两次基本按下，给出 (4+2+1=7)。 此示例演示了为什么有序状态不能仅由当前无序多重集替换。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(n)) | (O(n)) | 状态图只有 28 个状态，每个输入字符最多检查 28 个先前状态和 6 个目标排列。 |
 | 空间| (O(1)) | (O(1)) | The distance table and DP arrays have constant size, independent of (n). |

 输入可以包含 (10^5) 个特殊技能，因此对 (n) 的线性依赖是复杂性的相关部分。 恒定状态空间很小，并且实现在最坏的情况下仅执行几百万次简单转换，这完全在预期限制内。 

## 测试用例```python
import sys
import io
from collections import deque
from itertools import permutations

ELEMENTS = "QWE"

SPECIAL = {
    "Y": "QQQ",
    "V": "QQW",
    "G": "QQE",
    "C": "WWW",
    "X": "QWW",
    "Z": "WWE",
    "T": "EEE",
    "F": "QEE",
    "D": "WEE",
    "B": "QWE",
}

def make_solver():
    states = [()]
    index = {(): 0}
    q = deque([()])

    while q:
        state = q.popleft()

        for ch in ELEMENTS:
            nxt = state + (ch,)
            if len(nxt) > 3:
                nxt = nxt[-3:]

            if nxt not in index:
                index[nxt] = len(states)
                states.append(nxt)
                q.append(nxt)

    m = len(states)
    dist = [[10**9] * m for _ in range(m)]

    for start in range(m):
        dist[start][start] = 0
        q = deque([start])

        while q:
            u = q.popleft()

            for ch in ELEMENTS:
                nxt = states[u] + (ch,)
                if len(nxt) > 3:
                    nxt = nxt[-3:]

                v = index[nxt]

                if dist[start][v] == 10**9:
                    dist[start][v] = dist[start][u] + 1
                    q.append(v)

    targets = {}

    for skill, elements in SPECIAL.items():
        targets[skill] = tuple(
            index[p] for p in set(permutations(elements))
        )

    def run(inp: str) -> str:
        s = inp.strip()

        inf = 10**9
        dp = [inf] * m
        dp[index[()]] = 0

        for skill in s:
            ndp = [inf] * m

            for u in range(m):
                if dp[u] == inf:
                    continue

                for v in targets[skill]:
                    ndp[v] = min(
                        ndp[v],
                        dp[u] + dist[u][v] + 1
                    )

            dp = ndp

        return str(min(dp))

    return run

run = make_solver()

# Provided sample
assert run("XDTBVV") == "15", "sample 1"

# Constructed second sample
assert run("XV") == "7", "two different skills requiring ordered-state tracking"

# Minimum-size input
assert run("B") == "4", "one special skill starts from an empty inventory"

# Repeated skill
assert run("YY") == "5", "the inventory survives R"

# All-equal values
assert run("TTTTT") == "8", "EEE is already present after the first invocation"

# Maximum-size input
assert run("Y" * 100000) == str(100003), "maximum input length"

# Boundary transition where one additional element is not enough
assert run("XY") == "8", "changing QWW into QQQ requires three Q presses"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`B`|`4`| 初始空库存 |
 |`YY`|`5`| 之后重复使用相同的库存`R`|
 |`TTTTT`|`8`| 重复相同的特殊技能|
 |`XV`|`7`| 元素的时间顺序 |
 |`XY`|`8`| FIFO 替换和三键转换 |
 |`Y`重复100000次|`100003`| 最大输入尺寸和线性处理|

 ## 边缘情况

 用于输入`B`，算法从空状态开始。 每个完整的目标状态代表`QWE`距离空状态是三个BFS边，因为创建第一个库存需要三个基本技能。 然后 DP 添加一个`R`，生产`4`。 一开始就没有假定人为的完整状态。 

用于输入`YY`，在第一次转换之后，唯一相关的清单是以下的排列`QQQ`，所有这些实际上都是相同的有序状态`QQQ`。 第二个`Y`可以从`QQQ`到自身的距离为零，所以只有第二个`R`已添加。 答案是`4+1=5`。 

用于输入`XV`，第一个`X`可以构建为`QWW`用于四项操作，包括`R`。 从`QWW`， 一`Q`产生`WWQ`，其多重集仍然是`QWW`，所以它不能调用`V`然而。 一秒钟`Q`产生`WQQ`，其中有多重集`QQW`。 DP 找到距离 2 并加 1`R`, 给予`7`。 

用于输入`XY`，之后的库存`X`可以是`QWW`。 追加`Q`两次给出`WWQ`进而`WQQ`，其中都不包含三个`Q`是。 附第三个`Q`删除最旧的`W`和叶子`QQQ`。 因此，过渡距离为三，因此总距离为`4+3+1=8`。 这捕获了仅比较匹配元素类型数量而不模拟 FIFO 顺序的实现。 

对于由 (100000) 个副本组成的最大尺寸输入`Y`，第一次调用需要四次操作。 以后的每次调用只需花费一次`R`， 因为`QQQ`保持不变。 结果是(4+99999=100003)。 DP 独立处理每个字符，并且不会随着历史的长度而增长，因此大输入保持线性。
