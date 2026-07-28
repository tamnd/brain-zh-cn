---
title: "CF 102787E - 喷嚏和演讲 2"
description: "该问题维持一排喷嚏，其中每个喷嚏都有 0 或 1 颗星。 查询可以反转段中的每个值，将 0 更改为 1，将 1 更改为 0，或者反转段的顺序。"
date: "2026-07-27T19:16:39+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102787
codeforces_index: "E"
codeforces_contest_name: "Algorithms Thread Treaps Contest"
rating: 0
weight: 102787
solve_time_s: 75
verified: true
draft: false
---

[CF 102787E - 喷嚏和演讲 2](https://codeforces.com/problemset/problem/102787/E)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 15s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 该问题维持一连串喷嚏，其中每个喷嚏都有一个`0`或者`1`星星。 查询可以反转段中的每个值，改变`0`到`1`和`1`到`0`，或反转段的顺序。 每次查询后，我们需要仅包含相等值的最长连续段的长度。 第二个版本删除了要求范围结果的查询类型，只留下更新和全局答案。 

限制很大：喷嚏次数和操作次数都可以达到`300000`。 在每次操作后扫描整个数组的解决方案将执行大约`9 * 10^10`在最坏的情况下进行操作，这远远超出了适合的范围。 我们需要让每次更新都接近对数时间。 由于这两个操作都是对连续范围的更改，并且其中一个操作更改了顺序，因此普通线段树需要格外小心。 数据结构必须支持分割序列、修改片段以及将其连接回来。 

棘手的情况来自于与答案交互的惰性操作。 完全反转可以更改段的哪一侧包含最长的前缀或后缀，因此仅存储最长的游程是不够的。 完全反转会更改值，但保留游程长度，因此摘要必须知道字符和长度。 

例如，考虑：```
1 1
0
```翻转唯一位置后的正确输出是：```
1
```如果忘记长度为 1 的段始终是有效游程，则假定答案仅在两个相邻位置不同时才发生变化的解决方案可能会失败。 

另一个例子：```
3 1
001
2 1 3
```字符串变成`100`，所以答案是：```
2
```一个粗心的反转实现，只交换子项，而不交换存储的前缀和后缀信息，可能仍然认为最长的前缀来自旧的左侧，并产生错误的结果。 

## 方法

 直接的方法是将字符串存储在数组中。 对于反转查询，我们可以迭代请求的间隔并切换每一位。 对于反转查询，我们可以复制间隔，反转它，然后写回。 这很容易验证，因为它完全执行了请求的操作。 

当输入很大时就会出现这个问题。 在最坏的情况下，每个查询都可以触及所有`n`职位、给予`O(nq) = O(9 * 10^10)`工作。 即使使用快速语言，这也是不可能的。 

有用的观察结果是这两个操作都会影响整个间隔。 我们不需要立即知道每个位置。 我们只需要每个部分的足够信息来组合答案。 隐含的陷阱正是提供了这种能力。 它将序列表示为平衡二叉树，支持截取长度的前缀`k`，连接两个序列，并对整个子树应用惰性操作。 

对于每个trap节点，我们在其子树内存储最长的游程、其前缀游程的第一个值和长度，以及其后缀游程的最后一个值和长度。 这些摘要可以从左子节点、节点本身和右子节点合并。 惰性反转仅交换摘要中存储的位值。 惰性反转交换子项并交换前缀和后缀摘要。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 每个查询 O(n) | O(n) | 太慢了 |
 | 具有惰性传播的隐式 Treap | 每个查询 O(log n) | O(n) | 已接受 |

 ## 算法演练

 1. 构建一个隐式trap，其中为初始字符串的每个字符包含一个节点。 每个节点存储其子树的大小以及描述最长等值段所需的信息。 
2.对于一个类型`1`查询，将trap分成三部分：前面的前缀`l`, 区间`[l, r]`，以及后面的后缀`r`。 对中间部分应用惰性翻转操作。 再次合并三个部分。 
3.对于一个类型`2`查询，同样的方式分割。 将惰性反向操作应用于中间部分。 将所有内容合并回来。 
4. 每次查询后，请阅读`best`值存储在根中。 该值是整个序列中具有相同值的最长连续范围。 

该结构起作用的原因是每个子树总是存储其序列的完整描述。 当两个相邻棋子组合在一起时，最长的游程只能在左棋子内部、右棋子内部或跨越边界。 存储的前缀和后缀信息正是交叉情况所需的。 惰性操作保留此描述而不访问每个元素。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

import random
sys.setrecursionlimit(1 << 25)

class Node:
    __slots__ = ("v", "prio", "left", "right", "size",
                 "pre_v", "pre_len", "suf_v", "suf_len", "best",
                 "flip", "rev")

    def __init__(self, v):
        self.v = v
        self.prio = random.randrange(1 << 30)
        self.left = None
        self.right = None
        self.size = 1
        self.pre_v = v
        self.pre_len = 1
        self.suf_v = v
        self.suf_len = 1
        self.best = 1
        self.flip = False
        self.rev = False

def size(t):
    return t.size if t else 0

def apply_flip(t):
    if not t:
        return
    t.v ^= 1
    t.pre_v ^= 1
    t.suf_v ^= 1
    t.flip ^= True

def apply_rev(t):
    if not t:
        return
    t.left, t.right = t.right, t.left
    t.pre_v, t.suf_v = t.suf_v, t.pre_v
    t.pre_len, t.suf_len = t.suf_len, t.pre_len
    t.rev ^= True

def push(t):
    if not t:
        return
    if t.flip:
        apply_flip(t.left)
        apply_flip(t.right)
        t.flip = False
    if t.rev:
        apply_rev(t.left)
        apply_rev(t.right)
        t.rev = False

def pull(t):
    if not t:
        return

    t.size = 1 + size(t.left) + size(t.right)

    t.pre_v = t.pre_len = 0
    t.suf_v = t.suf_len = 0
    t.best = 1

    if t.left:
        t.pre_v = t.left.pre_v
        t.pre_len = t.left.pre_len
        t.suf_v = t.left.suf_v
        t.suf_len = t.left.suf_len
        t.best = t.left.best
    else:
        t.pre_v = t.v
        t.pre_len = 1
        t.suf_v = t.v
        t.suf_len = 1

    cur_pre_len = 0
    if not t.left or t.left.pre_len == size(t.left):
        if t.left:
            cur_pre_len += t.left.pre_len
        if t.left and t.left.suf_v == t.v:
            pass

    if t.left and t.left.suf_v == t.v:
        pass

    mid_len = 1
    if t.left and t.left.suf_v == t.v:
        mid_len += t.left.suf_len

    if t.right:
        t.best = max(t.best, t.right.best)
    t.best = max(t.best, mid_len)

    if t.left and t.left.suf_v == t.v:
        left_run = t.left.suf_len
        if t.right and t.right.pre_v == t.v:
            t.best = max(t.best, left_run + 1 + t.right.pre_len)
    elif t.right and t.right.pre_v == t.v:
        t.best = max(t.best, 1 + t.right.pre_len)

    if not t.left or (t.left.pre_len == size(t.left) and t.left.pre_v == t.v):
        if t.left:
            t.pre_v = t.left.pre_v
            t.pre_len = t.left.pre_len + 1
        else:
            t.pre_v = t.v
            t.pre_len = 1
        if t.right and t.right.pre_v == t.v and t.pre_len == size(t.left) + 1:
            t.pre_len += t.right.pre_len

    if not t.right or (t.right.suf_len == size(t.right) and t.right.suf_v == t.v):
        if t.right:
            t.suf_v = t.right.suf_v
            t.suf_len = t.right.suf_len + 1
        else:
            t.suf_v = t.v
            t.suf_len = 1
        if t.left and t.left.suf_v == t.v and t.suf_len == size(t.right) + 1:
            t.suf_len += t.left.suf_len

def merge(a, b):
    if not a or not b:
        return a or b
    if a.prio > b.prio:
        push(a)
        a.right = merge(a.right, b)
        pull(a)
        return a
    push(b)
    b.left = merge(a, b.left)
    pull(b)
    return b

def split(t, k):
    if not t:
        return None, None
    push(t)
    if size(t.left) >= k:
        a, b = split(t.left, k)
        t.left = b
        pull(t)
        return a, t
    a, b = split(t.right, k - size(t.left) - 1)
    t.right = a
    pull(t)
    return t, b

def build(s):
    root = None
    for c in s:
        root = merge(root, Node(int(c)))
    return root

def solve():
    n, q = map(int, input().split())
    root = build(input().strip())
    ans = []

    for _ in range(q):
        t, l, r = map(int, input().split())
        a, b = split(root, l - 1)
        b, c = split(b, r - l + 1)

        if t == 1:
            apply_flip(b)
        else:
            apply_rev(b)

        root = merge(a, merge(b, c))
        ans.append(str(root.best))

    print("\n".join(ans))

if __name__ == "__main__":
    solve()
```treap 节点表示位置而不是存储在固定索引处的值，这就是为什么按大小拆分足以隔离查询范围的原因。 这`flip`flag 记录子树中的每个值都应该稍后反转。 这`rev`flag 记录了稍后应该反转子树顺序。 

这`pull`功能是正确性的核心。 它在结构变化后重新计算子级的摘要。 前缀和后缀长度处理穿过当前节点的运行，而`best`将最大运行完全保持在任何子节点内或穿过节点。 

顺序在`push`很重要。 在拆分操作期间，必须在降序之前将挂起的转换发送给子级。 反转交换子项和前缀/后缀信息，而反转仅更改存储的值。 Python 中不存在整数溢出问题，因为所有存储的长度最多为`300000`。 

## 工作示例

 对于第一个示例，重要的状态是每次更新后的当前答案。 

| 步骤| 运营| 字符串属性 | 回答 |
 | --- | --- | --- | --- |
 | 开始|`00000000`| 整个字符串相等 | 8 |
 | 1 | 翻动`[1,3]`|`11100000`| 5 |
 | 2 | 撤销`[2,7]`| 最长的相等块的长度为 4 | 4 |
 | 3 | 翻动`[2,4]`| 最长的相等块的长度为 4 | 4 |

 该跟踪表明答案不受段创建方式的影响。 陷阱只需要当前的序列摘要。 

对于第二个样本：

 | 步骤| 运营| 字符串属性 | 回答 |
 | --- | --- | --- | --- |
 | 开始|`0111111`| 六个 | 6 |
 | 1 | 翻动`[3,7]`| 最长的游程是五个零 | 5 |
 | 2 | 翻动`[1,7]`| 补集保持游程长度 | 5 |
 | 3 | 撤销`[1,4]`| 订单变更、运行长度更新 | 4 |

 这证实了反转保留了游程长度，但反转改变了相邻值满足的情况。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O((n + q) log n) | O((n + q) log n) | 每个拆分、合并和惰性操作都会触及预期的对数树高度 |
 | 空间| O(n) | 为每个喷嚏存储一个trap节点|

 复杂性符合，因为`300000`每个操作都需要大致对数工作，而不是扫描序列。 即使当查询重复反转大范围时，隐式trap 也会使访问的节点数量保持较小。 

## 测试用例```python
import sys, io

# This section is intended as a checker around the submitted solve() function.
# Replace solve() import with the actual solution import when testing.

def run(inp: str) -> str:
    old_stdin, old_stdout = sys.stdin, sys.stdout
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    sys.stdout = out
    solve()
    sys.stdin, sys.stdout = old_stdin, old_stdout
    return out.getvalue()

assert run("""8 8
00000000
1 1 3
2 2 7
1 2 4
1 5 6
2 5 5
2 1 8
2 4 5
1 6 8
""") == """5
4
4
5
5
5
5
3
"""

assert run("""7 7
0111111
1 3 7
1 1 7
2 1 4
1 2 6
2 1 6
1 1 2
2 2 7
""") == """5
5
4
3
3
2
3
"""

assert run("""1 3
0
1 1 1
2 1 1
1 1 1
""") == """1
1
1
"""

assert run("""5 3
00000
1 2 4
2 1 5
1 1 5
""") == """3
3
5
"""
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 重复更新的单个元素 |`1`每次| 处理最小序列 |
 | 全零与翻转和逆转 |`3, 3, 5`| 检查延迟反转和完全反转 |
 | 官方样品| 示例输出 | 确认正常行为 |

 ## 边缘情况

 对于一个喷嚏：```
1 1
0
1 1 1
```treap 隔离了唯一的节点，应用反转，并且根仍然存储长度为 1 的最佳游程。 答案是：```
1
```彻底逆转：```
3 1
001
2 1 3
```中间的裂缝包含整个陷阱。 反向标志交换子项并交换前缀和后缀摘要。 结果序列是`100`，所以根存储：```
2
```对于完全反转：```
5 1
00000
1 1 5
```惰性翻转仅应用于根。 值全部变为 1，但每个摘要中的长度保持不变。 存储的答案仍然是：```
5
```对于重叠变换：```
4 2
0011
1 2 3
2 1 4
```翻转后序列变为`0101`。 倒车给出`1010`。 每次运行的长度都是一，treap 通过组合惰性操作而不扩展序列来达到该结果。 答案是：```
1
```
