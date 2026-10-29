---
title: "CF 1531D - \u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u0443\u0435\u043c\u0417\u0438\u043d\u0433\u0435\u0440 | 颜色"
description: "我们有一个按时间顺序排列的机器人消息列表。 机器人保留两部分状态。 第一个是当前是否锁定颜色更改。 第二种是当前的圆顶颜色，七种彩虹颜色之一。 最初，圆顶是蓝色的，颜色变化已解锁。"
date: "2026-06-10T16:48:08+07:00"
tags: ["codeforces", "competitive-programming", "*special"]
categories: ["algorithms"]
codeforces_contest: 1531
codeforces_index: "D"
codeforces_contest_name: "VK Cup 2021 - \u041a\u0432\u0430\u043b\u0438\u0444\u0438\u043a\u0430\u0446\u0438\u044f (Engine)"
rating: 0
weight: 1531
solve_time_s: 127
verified: true
draft: false
---

[CF 1531D - \u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u0443\u0435\u043c \u0417\u0438\u043d\u0433\u0435\u0440 | 颜色](https://codeforces.com/problemset/problem/1531/D)

 **评级：** -
 **标签：** *特别
 **求解时间：** 2m 7s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个按时间顺序排列的机器人消息列表。 机器人保留两部分状态。 

第一个是当前是否锁定颜色更改。 

第二种是当前的圆顶颜色，七种彩虹颜色之一。 

最初，圆顶是蓝色的，颜色变化已解锁。 

每条消息都作用于当前状态。 

一个`lock`如果系统尚未锁定，消息会将系统转入锁定状态。 

一个`unlock`如果系统尚未解锁，消息会将系统转入解锁状态。 

仅当系统当前解锁时，颜色消息才会更改圆顶颜色。 如果系统被锁定，则颜色消息将被忽略。 

在初始历史记录之后，我们最多会收到$10^5$编辑。 每次编辑都会替换历史记录中的一条消息。 每次编辑后，整个历史都必须从原始初始状态重新处理，并且我们必须输出生成的圆顶颜色。 

限制才是真正的挑战。 消息数和编辑数均能达到$10^5$。 每次编辑后重播整个历史记录大约需要$10^{10}$最坏情况下的消息应用，远远超出了比赛时间限制。 

关键的观察结果是机器人的状态空间很小。 只有七种颜色和两种锁定状态，因此只存在十四种可能的状态。 

当锁定时执行颜色消息时，会出现微妙的边缘情况。 

例子：```
lock
red
unlock
```最终的颜色仍然是蓝色。 这`red`命令被忽略，因为系统在到达时已锁定。 

另一个容易犯的错误是治疗`lock`和`unlock`作为无条件分配。 

例子：```
lock
lock
unlock
```第二个`lock`什么也不做。 该行为仍然是明确定义的，因为消息在当前状态上运行，而不是在消息历史记录本身上运行。 

第三种边缘情况是编辑旧消息。 

例子：```
1: red
2: lock
3: green
```最初的结果是`red`。 

如果消息2被编辑成`unlock`，那么消息3突然生效，答案变成`green`。 

任何尝试仅更新后缀颜色而不重新考虑状态转换结构的解决方案都会失败。 

## 方法

 暴力解决方案很简单。 将消息列表视为一个程序。 从初始状态开始，处理所有$n$消息并获得最终颜色。 每次编辑后，修改消息并再次运行整个模拟。 

这是有效的，因为机器人的规则是确定性的。 问题是成本。 每个查询都需要$O(n)$工作，并且有$10^5$查询。 总复杂度变为$O(nt)$，达到$10^{10}$运营。 

重要的观察是，每条消息实际上都是十四种可能状态集合上的函数。 

例如，`lock`将每个解锁状态映射到相应的锁定状态，并保持锁定状态不变。 

颜色命令，例如`red`将每个解锁状态映射到解锁红色状态，并保持每个锁定状态不变。 

由于每条消息都是一个状态转换函数，因此一整段消息只是它们的函数的组合。 

这立即表明了线段树。 

对于每个节点，我们存储该段表示的函数。 由于状态空间仅包含 14 个状态，因此函数可以存储为长度为 14 的数组，其中`f[s]`是将段应用到状态后的结果状态`s`。 

当组合两个子段时，我们组合它们的函数。 如果左边的线段代表`L`右段代表`R`，那么父代代表`R ∘ L`，因为来自左半部分的消息先于来自右半部分的消息执行。 

一个点更新会更改一条消息，因此仅$O(\log n)$必须重新计算线段树节点。 每次重新计算都由两个大小为 14 的函数组成，这是一项持续的工作。 

将根函数应用于初始状态即可得到答案`(unlocked, blue)`并提取所得的颜色。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |$O(nt)$|$O(1)$| 太慢了|
 | 最佳|$O(14 \cdot (n + t \log n))$|$O(14n)$| 已接受 |

 ## 算法演练

 1. 将每个可能的机器人状态编码为 0 到 13 之间的整数。 
2. 将状态表示为`(locked, color)`。 
3. 对于每种可能的消息类型，预先计算其在所有 14 种状态上的转换函数。 
4. 构建一棵线段树，其中每个叶子存储与一条消息对应的函数。 
5. 对于内部节点，组合其子节点的函数。 如果`left`和`right`是子函数，那么：`parent[s] = right[left[s]]`因为左边的段首先执行。 
6. 要获得当前答案，请将根函数应用于初始状态`(unlocked, blue)`。 
7. 提取结果状态的颜色分量并打印其名称。 
8. 对于编辑操作，替换相应的叶函数。 
9. 使用相同的组合规则重新计算所有祖先直到根。 
10. 再次查询根并输出结果颜色。 

### 为什么它有效

 每条消息定义了十四状态自动机的确定性变换。 函数组合与消息的顺序执行完全匹配。 线段树节点存储其整个区间产生的变换。 通过对树结构的归纳，每个节点都正确地代表了处理其段内所有消息的效果。 

根区间覆盖了整个历史，因此它的作用正是从初始状态重放完整消息序列的效果。 点更新后，只有包含该位置的线段发生变化，并且重新计算组合会恢复每个受影响节点的正确变换。 因此，每个报告的颜色都与完整重播的结果相匹配。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

colors = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"]
color_id = {c: i for i, c in enumerate(colors)}

STATE_COUNT = 14

def state_id(locked, color):
    return locked * 7 + color

# Precompute transition function for every possible message.
funcs = {}

for msg in ["lock", "unlock"] + colors:
    f = [0] * STATE_COUNT

    for locked in range(2):
        for color in range(7):
            s = state_id(locked, color)

            if msg == "lock":
                ns = state_id(1, color) if locked == 0 else s
            elif msg == "unlock":
                ns = state_id(0, color) if locked == 1 else s
            else:
                if locked == 0:
                    ns = state_id(0, color_id[msg])
                else:
                    ns = s

            f[s] = ns

    funcs[msg] = f

def compose(left, right):
    # right ∘ left
    return [right[left[i]] for i in range(STATE_COUNT)]

n = int(input())
messages = [input().strip() for _ in range(n)]

size = 1
while size < n:
    size <<= 1

identity = list(range(STATE_COUNT))
seg = [identity[:] for _ in range(2 * size)]

for i in range(n):
    seg[size + i] = funcs[messages[i]]

for i in range(size - 1, 0, -1):
    seg[i] = compose(seg[i * 2], seg[i * 2 + 1])

initial_state = state_id(0, color_id["blue"])

def answer():
    final_state = seg[1][initial_state]
    color = final_state % 7
    return colors[color]

out = [answer()]

t = int(input())

for _ in range(t):
    pos, msg = input().split()
    pos = int(pos) - 1

    p = size + pos
    seg[p] = funcs[msg]

    p //= 2
    while p:
        seg[p] = compose(seg[p * 2], seg[p * 2 + 1])
        p //= 2

    out.append(answer())

sys.stdout.write("\n".join(out))
```状态编码是最重要的实现细节。 每个状态必须唯一地表示锁定标志和当前颜色。 使用`locked * 7 + color`给出从 0 到 13 的紧凑范围。 

每条消息都被转换为长度为 14 的转换表。 这将问题从模拟消息转变为组合函数。 

线段树存储完整的函数而不是标量值。 构图顺序很重要。 如果左段在右段之前执行，则父级必须代表`right[left[s]]`。 颠倒此顺序会产生错误的答案。 

恒等函数用于未使用的叶子。 由于使用身份进行组合不会改变任何内容，因此填充树变得安全。 

## 工作示例

 ### 示例 1

 最初的历史：

 | 步骤| 留言 | 锁定| 颜色 |
 | --- | --- | --- | --- |
 | 开始| - | 没有 | 蓝色|
 | 1 | 红色| 没有 | 红色|
 | 2 | 紫罗兰| 没有 | 紫罗兰|
 | 3 | 解锁| 没有 | 紫罗兰|
 | 4 | 红色| 没有 | 红色|
 | 5 | 橙色| 没有 | 橙色|
 | 6 | 锁| 是的 | 橙色|
 | 7 | 靛蓝| 是的 | 橙色|

 最终答案是`orange`。 

最后一个`indigo`由于系统被锁定而被忽略。 

将消息 5 编辑为`green`，相同的重播产生`green`, which matches the sample output.

 ### 自定义示例```
3
lock
red
unlock
```| 步骤| 留言 | 锁定| 颜色 |
 | --- | --- | --- | --- |
 | 开始| - | 没有 | 蓝色|
 | 1 | 锁| 是的 | 蓝色|
 | 2 | 红色| 是的 | 蓝色|
 | 3 | 解锁| 没有 | 蓝色|

 结果依然`blue`。 

此示例说明了为什么颜色命令不能被视为无条件分配。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(14 \cdot (n + t \log n))$| 建筑需要功能组合，每次更新都会触及$O(\log n)$节点 |
 | 空间|$O(14n)$| 每个线段树节点都存储一个大小为 14 | 的函数

 由于 14 是一个固定常数，因此实际复杂度本质上是$O(n + t \log n)$，可以轻松处理$10^5$消息和$10^5$编辑。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    colors = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"]
    color_id = {c: i for i, c in enumerate(colors)}

    STATE_COUNT = 14

    def state_id(locked, color):
        return locked * 7 + color

    funcs = {}

    for msg in ["lock", "unlock"] + colors:
        f = [0] * STATE_COUNT
        for locked in range(2):
            for color in range(7):
                s = state_id(locked, color)

                if msg == "lock":
                    ns = state_id(1, color) if locked == 0 else s
                elif msg == "unlock":
                    ns = state_id(0, color) if locked == 1 else s
                else:
                    ns = state_id(0, color_id[msg]) if locked == 0 else s

                f[s] = ns
        funcs[msg] = f

    def compose(a, b):
        return [b[a[i]] for i in range(STATE_COUNT)]

    sys.stdin = io.StringIO(inp)
    input = sys.stdin.readline

    n = int(input())
    msgs = [input().strip() for _ in range(n)]

    size = 1
    while size < n:
        size <<= 1

    identity = list(range(STATE_COUNT))
    seg = [identity[:] for _ in range(2 * size)]

    for i in range(n):
        seg[size + i] = funcs[msgs[i]]

    for i in range(size - 1, 0, -1):
        seg[i] = compose(seg[i * 2], seg[i * 2 + 1])

    initial = state_id(0, color_id["blue"])

    def ans():
        s = seg[1][initial]
        return colors[s % 7]

    out = [ans()]

    t = int(input())
    for _ in range(t):
        p, msg = input().split()
        p = int(p) - 1

        idx = size + p
        seg[idx] = funcs[msg]

        idx //= 2
        while idx:
            seg[idx] = compose(seg[idx * 2], seg[idx * 2 + 1])
            idx //= 2

        out.append(ans())

    return "\n".join(out)

# provided sample
assert run(
"""7
red
violet
unlock
red
orange
lock
indigo
6
5 green
6 lock
6 yellow
4 lock
1 lock
5 unlock
"""
) == """orange
green
green
indigo
violet
blue
indigo"""

# minimum size
assert run(
"""1
blue
1
1 red
"""
) == """blue
red"""

# locked color ignored
assert run(
"""2
lock
red
1
2 green
"""
) == """blue
blue"""

# unlock enables later color
assert run(
"""3
lock
red
unlock
1
2 green
"""
) == """blue
blue"""

# edit old message changes future behavior
assert run(
"""3
red
lock
green
1
2 unlock
"""
) == """red
green"""
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 已编辑单条消息 | 蓝色 → 红色 | 最小尺寸|
 |`lock`然后上色| 蓝色| 锁定时忽略颜色 |
 |`lock`， 颜色，`unlock`| 蓝色| 解锁不重玩旧色|
 | 编辑`lock`进入`unlock`| red → green | 影响后续消息的历史编辑 |

 ## 边缘情况

 考虑：```
2
lock
red
```系统在颜色命令到达之前被锁定。 转换函数为`red`保持每个锁定状态不变，因此最终颜色仍为蓝色。 线段树的组成自然地保留了这种行为。 

考虑：```
3
lock
lock
unlock
```第二个`lock`将锁定状态映射到自身。 它的转换函数是幂等的。 与第一个组合`lock`产生与单个锁定操作完全相同的效果。 

考虑：```
3
red
lock
green
```答案是`red`。 如果消息 2 被编辑为`unlock`，则第三条消息生效，答案变为`green`。 更新仅更改一片叶子，但重新计算的合成会自动将效果传播到整个历史记录。
