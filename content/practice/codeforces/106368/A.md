---
title: "CF 106368A - 健忘的 Shustrik 和遥控器"
description: "我们有一个计算器，其屏幕以值 A 开头。计算器有一个固定数字 M，每次按下按钮都会应用四种转换之一：加 M、减 M、乘以 M，或用除以 M 后的余数替换当前值。"
date: "2026-06-25T08:14:34+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 106368
codeforces_index: "A"
codeforces_contest_name: "Innopolis Open 2025-2026. Final round"
rating: 0
weight: 106368
solve_time_s: 50
verified: true
draft: false
---

[CF 106368A - 健忘的 Shustrik 和远程控制](https://codeforces.com/problemset/problem/106368/A)

 **评级：** -
 **标签：** -
 **求解时间：** 50s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个计算器，其屏幕以一个值开头`A`。 计算器有一个固定的数字`M`，并且每次按下按钮都会应用四种转换之一：`M`, 减去`M`, 乘以`M`，或用除以后的余数替换当前值`M`。 目标不是达到精确值。 我们只需要最终的屏幕值具有与以下相同的余数：`B`当除以`N`。 任务是输出实现此目的的最短按钮按下序列，或报告这是不可能的。 

的价值观`A`和`M`可以大到`10^9`， 但`N`至多是`2 * 10^6`。 这立即排除了存储实际计算器值的可能性，因为它们在乘法后会变得非常大。 我们需要一个基于余数的状态表示，并且状态的数量必须接近`N`以适应极限。 解决方案执行诸如尝试所有可能的值之类的操作`M`是不可能的，因为`M`没有有用的小界限。 

困难的边缘情况来自`%`手术。 当我们只知道值模时，它的行为与其他操作不同`N`， 因为`% M`取决于值模`M`。 

例如：```
A = 5, M = 6, B = 1, N = 6
```答案是`-1`。 一个粗心的实现，仅跟踪值模`N`可能会认为`%`操作总是会产生残留物`5 mod 6`，但是之后的计算器值`%`必须在范围内`[0, M - 1]`，这里的可达残基从不包括`1`。 

另一个重要的情况是乘法之前发生过`%`：```
A = 5, M = 9, B = 1, N = 8
```一种最佳序列是：```
*%+
```后`*`，该值变为`45`，可除以`M`， 所以`%`产生`0`， 不是`A mod M`。 如果一个实现假设`%`总是给出原始值模`M`，它将错过有效路径。 

## 方法

 直接的暴力方法将模拟每种可能的按钮按下顺序。 由于每一步都有四种选择，因此深度`d`搜索探索最多`4^d`序列。 即使答案最多保证是`N`， 和`N`达到 200 万，这种方法远远超出了可能的范围。 

有用的观察是我们永远不需要完整的计算器值。 我们只需要对值取模`N`，加上足够的信息来预测什么`%`会做。 

设当前值为`X`。 我们跟踪两件事：

 第一个是`X mod N`，因为这告诉我们是否已经达到了所需的条件。 

第二个是`X mod M`， 因为`%`取代`X`正是这个余数。 

令人惊讶的部分是`X mod M`整个过程中只有两个可能的值。 最初是`A mod M`。 加或减`M`不会改变它。 乘以`M`做到了`0`。 这`%`运算保持相同的模值`M`，因为新数已经等于旧数的余数。 

所以每个状态都可以表示为：```
(current value modulo N, current value modulo M is A mod M or 0)
```这最多给出`2N`州。 每个操作都成为正常的图边，并通过广度优先搜索找到最短序列。 

暴力搜索会失败，因为它探索的是序列。 上面的观察将问题转化为在小图中寻找最短路径。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(4^N) | O(4^N) | O(4^N) | O(4^N) | 太慢了|
 | 最佳| O(N) | O(N) | 已接受 |

 ## 算法演练

 1. 隐式构建一个图，其中每个状态都是一对`(r, t)`。 这里`r`是当前值模`N`， 和`t`告诉当前值是否取模`M`是原始值`A mod M`或零。 
2. 启动BFS`(A mod N, 0)`。 该标志最初为零，因为在发生任何乘法之前，该值模`M`仍然是`A mod M`。 
3. 对于每个弹出状态，生成四种可能的操作。 

这`+`运算仅更改模数的余数`N`：```
r -> (r + M) mod N
```该标志保持不变，因为添加`M`不改变模余数`M`。 
4. 应用`-`操作类似：```
r -> (r - M) mod N
```再次，模数`M`余数不变。 
5. 应用乘法：```
r -> (r * M) mod N
```新标志变为 1，因为该值现在可被整除`M`。 
6. 申请`%`。 

如果标志为零，则新值为`A mod M`。 如果标志为 1，则新值为零。 旗帜本身不会改变。 
7.当状态有余数时停止BFS`B`已达到。 由于 BFS 通过增加距离来探索状态，因此第一个这样的状态给出最短的序列。 
8. 存储先前的状态以及用于达到每个新状态的操作。 从答案状态向后跟踪这些链接以重建操作顺序。 

为什么它有效：

 BFS 图包含压缩为等效状态的每种可能的计算器情况。 具有相同模数的两个计算器值`N`余数与模相同`M`对于所有四个操作，余数始终具有相同的未来行为。 由于第二个分量只能是`A mod M`或者`0`，该图包含所有相关的可能性。 BFS 在这个完整的状态图中找到最短路径，因此重构的序列是最小的。 

## Python 解决方案```python
import sys
from collections import deque

input = sys.stdin.readline

def solve():
    A, M, B, N = map(int, input().split())

    base = A % M

    total = 2 * N
    parent = [-1] * total
    parent_op = [''] * total

    def get_id(flag, rem):
        return flag * N + rem

    start = get_id(0, A % N)

    q = deque([start])
    parent[start] = start

    answer = -1

    while q:
        cur = q.popleft()
        flag = cur // N
        rem = cur % N

        if rem == B:
            answer = cur
            break

        nxt = [
            (flag, (rem + M) % N, '+'),
            (flag, (rem - M) % N, '-'),
            (1, (rem * M) % N, '*'),
            (flag, base % N if flag == 0 else 0, '%')
        ]

        for nf, nr, op in nxt:
            nid = get_id(nf, nr)
            if parent[nid] == -1:
                parent[nid] = cur
                parent_op[nid] = op
                q.append(nid)

    if answer == -1:
        print(-1)
        return

    path = []
    while answer != start:
        path.append(parent_op[answer])
        answer = parent[answer]

    path.reverse()

    print(len(path))
    if path:
        print(''.join(path))

if __name__ == "__main__":
    solve()
```该代码将每个状态存储为整数。 有国旗的国家`0`占用索引`0`通过`N-1`，以及有国旗的国家`1`占用索引`N`通过`2N-1`。 这使得 BFS 数组保持紧凑，并避免元组出现在热循环中。 

转换列表直接跟随四个计算器操作。 这`%`转换是唯一需要额外标志的转换。 一个常见的错误是在之后更改标志`%`，但余数取模`M`保持不变，因为结果`%`已经是余数了。 

父数组允许重建，而无需在 BFS 队列中存储完整的字符串。 这很重要，因为在最大的情况下，该图最多可以包含四百万个状态。 

## 工作示例

 对于第一个样本：```
1 3 2 5
```最短路径是`+*`。 

| 步骤| 国旗| 值模 N | 运营|
 | --- | --- | --- | --- |
 | 0 | 原创| 1 | 开始 |
 | 1 | 原创| 4 | + |
 | 2 | 零| 2 | * |

 乘法之后，标志发生变化，因为计算器的值可以被整除`M`。 最后的余数为`2`，与目标匹配。 

对于第二个样本：```
6 7 2 4
```| 步骤| 国旗| 值模 N | 运营|
 | --- | --- | --- | --- |
 | 0 | 原创| 2 | 开始 |

 初始值已经具有所需的余数，因此 BFS 立即返回一个空序列。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(N) | 最多有`2N`状态和每个状态四个转换。 |
 | 空间| O(N) | BFS 队列和父数组为每个状态存储恒定数量的数据。 |

 的最大值`N`是 200 万，因此该图最多有 400 万个状态。 该算法避免了对大小的依赖`A`或者`M`，这就是使它符合约束条件的原因。 

## 测试用例```python
import sys, io
from collections import deque

def run(inp: str) -> str:
    old = sys.stdin
    sys.stdin = io.StringIO(inp)

    A, M, B, N = map(int, sys.stdin.readline().split())

    base = A % M
    total = 2 * N
    parent = [-1] * total
    parent_op = [''] * total

    def gid(flag, rem):
        return flag * N + rem

    start = gid(0, A % N)
    q = deque([start])
    parent[start] = start
    ans = -1

    while q:
        cur = q.popleft()
        flag = cur // N
        rem = cur % N

        if rem == B:
            ans = cur
            break

        for nf, nr, op in [
            (flag, (rem + M) % N, '+'),
            (flag, (rem - M) % N, '-'),
            (1, (rem * M) % N, '*'),
            (flag, base % N if flag == 0 else 0, '%')
        ]:
            nxt = gid(nf, nr)
            if parent[nxt] == -1:
                parent[nxt] = cur
                parent_op[nxt] = op
                q.append(nxt)

    if ans == -1:
        out = "-1"
    else:
        res = []
        while ans != start:
            res.append(parent_op[ans])
            ans = parent[ans]
        res.reverse()
        out = str(len(res)) + ("\n" + ''.join(res) if res else "")

    sys.stdin = old
    return out

assert run("1 3 2 5\n") == "2\n+*", "sample 1"
assert run("6 7 2 4\n") == "0", "sample 2"

assert run("5 6 1 6\n") == "-1", "impossible case"
assert run("0 6 3 7\n") == "3\n---", "negative moves are useful"
assert run("5 9 1 8\n") == "3\n*%+", "multiplication changes modulo M state"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 3 2 5`|`2`运营| 基本最短路径重建 |
 |`6 7 2 4`|`0`运营| 已经满足条件 |
 |`5 6 1 6`|`-1`| 检测不可达状态 |
 |`0 6 3 7`|`3`运营| 重复减法和边界残差 |
 |`5 9 1 8`|`3`运营| 正确处理`%`后`*`|

 ## 边缘情况

 当起始值已经满足条件时，BFS必须立即返回。 对于输入：```
6 7 2 4
```初始余数为`6 mod 4 = 2`，等于`B`，所以空序列是最短的可能答案。 

什么时候`%`在乘法之后使用，模`M`状态为零。 为了：```
5 9 1 8
```序列`*%+`作品。 乘法改变了隐藏的模数`M`值为零，`%`保持屏幕为零，并且`+`将剩余部分移至目标。 仅跟踪`A mod M`会错过这条路。 

当答案不存在时，BFS 会探索每个可到达的压缩状态，并且永远不会到达剩余的`B`。 为了：```
5 6 1 6
```所有可能的状态都被穷尽而没有找到剩余`1`，所以算法正确打印`-1`。
