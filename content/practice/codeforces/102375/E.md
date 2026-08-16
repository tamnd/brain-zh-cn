---
title: "CF 102375E - \u0414\u0443\u043c\u0441\u043a\u0438\u0439\u0440\u0435\u0433\u043b\u0430\u043c\u0435\u043d\u0442"
description: "我们得到了议会会议的时间记录。 每个添加 x 事件都意味着 x 方引入了一项新法案。 新提出的法案立即成为正在讨论的法案，因此之前正在讨论的法案被暂停。"
date: "2026-08-15T17:54:05+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102375
codeforces_index: "E"
codeforces_contest_name: "\u041a\u0432\u0430\u043b\u0438\u0444\u0438\u043a\u0430\u0446\u0438\u043e\u043d\u043d\u044b\u0439 \u0440\u0430\u0443\u043d\u0434 \u0427\u0435\u043c\u043f\u0438\u043e\u043d\u0430\u0442\u0430 \u0421\u0435\u0432\u0435\u0440\u043e-\u0417\u0430\u043f\u0430\u0434\u0430 \u0420\u043e\u0441\u0441\u0438\u0438 \u0438 \u041c\u043e\u0441\u043a\u0432\u044b ICPC 2019"
rating: 0
weight: 102375
solve_time_s: 145
verified: false
draft: false
---

[CF 102375E - \u0414\u0443\u043c\u0441\u043a\u0438\u0439 \u0440\u0435\u0433\u043b\u0430\u043c\u0435\u043d\u0442](https://codeforces.com/problemset/problem/102375/E)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 25s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到了议会会议的时间记录。 每一个`Add x`事件意味着聚会`x`提出一项新法案。 新提出的法案立即成为正在讨论的法案，因此之前正在讨论的法案被暂停。 每一个`Vote x`事件意味着当前讨论的法案已被投票，并且记录的一方必须是提出该法案的一方。 投票结束后，讨论又回到了之前搁置的法案。 

这正是堆栈规则。 一个`Add`将新的账单放在所有未完成的账单之上。 一个`Vote`必须删除当前位于顶部的账单。 事件中所写的一方必须同意该最高法案。 当日志结束时，一定没有未完成的账单，所以栈一定是空的。 

输入最多包含 1000 个事件。 这个值足够小，即使是二次算法也可以轻松完成，但问题的结构为我们提供了仅具有堆栈的线性解决方案。 不需要图算法、动态编程或任何可能的订单搜索。 事实上，事件顺序完全决定了堆栈状态。 

第一个极端情况是在提出任何法案之前进行投票。 例如，```
1
Vote z
```必须产生`No`。 目前没有可投票的法案，因此粗心的实现仅检查是否使用了某些早期事件`z`可以接受不可能的会话。 

第二种边缘情况是投票支持暂停的法案而不是当前的法案。 例如，```
4
Add a
Add b
Vote a
Vote b
```产生`No`。 后`Add b`， 账单`b`正在讨论并法案`a`被暂停。 下一次投票必须是`b`， 不是`a`。 仅检查是否存在的实现`a`属于未完成的账单将错误地接受该顺序。 

第三种边缘情况是重复使用同一方。 例如，```
6
Add a
Add a
Vote a
Vote a
Add b
Vote b
```产生`Yes`。 两人`a`即使具有相同政党标签，法案也是不同的法案。 堆栈可以自然地处理这个问题，因为每个`Add a`创建另一个单独的堆栈条目。 

最后的边缘情况是最后未完成的账单。 例如，```
1
Add a
```产生`No`。 该法案已提出但从未进行表决，因此会议无法合法结束。 

## 方法

 直接的暴力模拟可以在每次投票前重复重建一组未完成的法案。 从日志的开头开始，我们先处理所有的`Add`和`Vote`事件并重建当前堆栈，然后检查其顶部是否有当前投票。 这是正确的，因为任何前缀之后的堆栈完全由该前缀决定。 

这个版本的问题是重复工作。 如果有 (K) 个事件，并且我们为每个事件重建堆栈，则第一个事件可能需要一个操作，第二个事件可能需要两个操作，依此类推。 在最坏的情况下，这大约需要

 [
 1 + 2 + \dots + K = O(K^2)
 ]

 操作，这是不必要的。 

关键的观察是前缀之后的状态不需要重建。 我们只需要前一个事件产生的状态。 一个`Add x`推动`x`，和一个`Vote x`检查当前顶部然后弹出它。 堆栈本身正是议会规则的数学模型。 

暴力破解之所以有效，是因为每个前缀都可以从事件历史记录中模拟，但由于多次重新计算相同的历史记录而失败。 每个事件仅以一种本地方式更改堆栈的观察结果使我们能够在一次传递中增量地维护状态。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(K²) | O(K) | K ≤ 1000 时接受，但速度不必要地慢 |
 | 最佳 | O(K) | O(K) | 已接受 |

 ## 算法演练

 1. 创建一个空堆栈。 它代表所有已提出但尚未获得最终投票的法案，当前讨论的法案位于顶部。 
2. 从左到右阅读事件。 该顺序无法重新排列，因为它是会话的时间顺序记录。 
3. 对于一个`Add x`事件、推送`x`到堆栈上。 新的法案立即打断了之前的讨论，因此它必然成为新的顶峰。 
4.对于一个`Vote x`事件发生时，首先检查栈是否为空。 如果为空，则说明当前没有正在讨论的法案，因此不可能记录日志。 
5. 如果栈不为空，则将其顶部元素与`x`。 如果他们不同，该活动就不可能进行，因为只能对当前讨论的法案进行投票。 返回`No`。 
6. 如果顶部等于`x`，弹出它。 该法案现已完成，其下的法案（如果存在）将再次成为活跃的讨论。 
7. 处理完所有事件后，检查堆栈是否为空。 空堆栈意味着每项提出的法案都获得了投票。 非空堆栈意味着至少有一张账单未完成，因此返回`No`。 

### 为什么它有效

 不变的是，在处理任何有效的前缀之后，堆栈按照中断顺序准确地包含未完成的帐单，当前讨论的帐单位于顶部。 一个`Add`通过将新的活动法案放在最上面来保留这个不变量。 有效的`Vote`通过准确删除活动账单并暴露之前暂停的账单来保留它。 如果投票涉及顶部以外的任何内容，则任何有效的会话都不会产生该事件。 如果堆栈最后非空，则某些讨论尚未完成。 因此，该算法准确地接受有效的事件序列。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    k = int(input())
    stack = []

    for _ in range(k):
        event, party = input().split()

        if event == "Add":
            stack.append(party)
        else:
            if not stack or stack[-1] != party:
                print("No")
                return
            stack.pop()

    print("Yes" if not stack else "No")

if __name__ == "__main__":
    solve()
```这`stack`list 存储所有未完成账单的当事人信件。 每次出现`Add`即使当事人的信件已经存在，也会创建一个新的堆栈条目，因为同一当事人提出的两个法案仍然是单独的法案。 

为了`Vote`，在访问之前必须进行空检查`stack[-1]`。 否则，投票作为第一个事件将导致无效的索引操作，而不是产生`No`。 

与的比较`stack[-1]`发生在`pop`。 如果标签不同，我们立即拒绝整个日志，因为删除任何较低的元素都会违反中断规则。 

最后，检查`not stack`处理每个讨论最终必须完成的要求。 Python整数不会出现在算法中，因此不存在溢出问题。 每个事件都只处理一次。 

## 工作示例

 ### 示例 1

 输入是：```
4
Add a
Add b
Vote a
Vote b
```状态变化是：

 | 活动 | 堆栈之前 | 行动| 堆栈之后 |
 | ---| ---| ---| ---|
 |`Add a`|`[]`| 推`a`|`[a]`|
 |`Add b`|`[a]`| 推`b`|`[a, b]`|
 |`Vote a`|`[a, b]`| 顶部是`b`, 不匹配 | 拒绝|
 |`Vote b`| 未达到| 未达到| 未达到|

 后`Add b`， 账单`b`是活动账单。 投票赞成`a`试图在新法案仍在讨论的同时完成一项暂停的法案，因此该顺序是不可能的。 

算法立即拒绝并打印`No`。 

### 示例 2

 输入是：```
8
Add z
Vote z
Add x
Add y
Add x
Vote x
Vote y
Vote x
```踪迹是：

 | 活动 | 堆栈之前 | 行动| 堆栈之后 |
 | ---| ---| ---| ---|
 |`Add z`|`[]`| 推`z`|`[z]`|
 |`Vote z`|`[z]`| 流行音乐`z`|`[]`|
 |`Add x`|`[]`| 推`x`|`[x]`|
 |`Add y`|`[x]`| 推`y`|`[x, y]`|
 |`Add x`|`[x, y]`| 推`x`|`[x, y, x]`|
 |`Vote x`|`[x, y, x]`| 流行音乐`x`|`[x, y]`|
 |`Vote y`|`[x, y]`| 流行音乐`y`|`[x]`|
 |`Vote x`|`[x]`| 流行音乐`x`|`[]`|

 每张投票都与当前顶部匹配，最后堆栈为空。 重复的`x`标签不会引起歧义，因为每个`Add x`贡献自己的堆栈条目。 

算法打印`Yes`。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(K) | 每个事件执行恒定数量的堆栈工作 |
 | 空间| O(K) | 在最坏的情况下，所有 K 事件都可以`Add`投票前的活动 |

 对于 (K \le 1000)，线性算法完全在限制范围内。 即使二次重建方法对于这个特定界限来说也足够小，但堆栈模拟更简单、更快，并且直接表达正在检查的规则。 

## 测试用例```python
import sys
import io

def solve():
    input = sys.stdin.readline
    k = int(input())
    stack = []

    for _ in range(k):
        event, party = input().split()

        if event == "Add":
            stack.append(party)
        else:
            if not stack or stack[-1] != party:
                print("No")
                return
            stack.pop()

    print("Yes" if not stack else "No")

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    solve()

    result = sys.stdout.getvalue().strip()

    sys.stdin = old_stdin
    sys.stdout = old_stdout

    return result

# Provided samples
assert run("""4
Add a
Add b
Vote a
Vote b
""") == "No", "sample 1"

assert run("""8
Add z
Vote z
Add x
Add y
Add x
Vote x
Vote y
Vote x
""") == "Yes", "sample 2"

assert run("""1
Vote z
""") == "No", "sample 3"

# Minimum-size input
assert run("""1
Add a
""") == "No", "unfinished single bill"

# A single complete bill
assert run("""2
Add z
Vote z
""") == "Yes", "single completed bill"

# All events use the same party
assert run("""6
Add a
Add a
Add a
Vote a
Vote a
Vote a
""") == "Yes", "nested bills from one party"

# Wrong nesting order
assert run("""6
Add a
Add b
Add c
Vote b
Vote c
Vote a
""") == "No", "vote must match the top"

# Maximum-size valid input
assert run("1000\n" + "\n".join(["Add a"] * 500 + ["Vote a"] * 500) + "\n") == "Yes", \
    "maximum-size valid sequence"

# Maximum-size invalid input
assert run("1000\n" + "\n".join(["Add a"] * 500 + ["Vote b"] + ["Vote a"] * 499) + "\n") == "No", \
    "maximum-size invalid sequence"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 / Add a`|`No`| 最小尺寸和未完成的最终堆栈|
 |`2 / Add z, Vote z`|`Yes`| 尽可能小的有效会话 |
 | 三`Add a`接下来是三个`Vote a`|`Yes`| 同一方有多个不同的账单 |
 |`Add a, Add b, Add c, Vote b, ...`|`No`| 暂停的法案不能在有效法案之前进行投票 |
 | 500 个添加，随后 500 个匹配投票 |`Yes`| 最大输入大小和深度堆栈 |
 | 500`a`添加后跟`Vote b`|`No`| 最大输入大小和立即不匹配检测 |

 ## 边缘情况

 ### 在任何添加之前投票

 对于```
1
Vote z
```堆栈开始为空。 该活动是一个`Vote`，因此算法在查看堆栈顶部之前先检查堆栈。 由于没有当前账单，因此打印`No`立即地。 这可以避免接受不可能的事件并尝试访问空堆栈。 

### 投票支持暂停法案

 对于```
4
Add a
Add b
Vote a
Vote b
```堆栈变成`[a, b]`第二次事件之后。 下一个活动要求投票`a`， 但`stack[-1]`是`b`。 该算法拒绝日志而不弹出任何内容。 这抓住了中心嵌套规则：新的账单必须先完成，然后中断的账单才能恢复。 

### 重复的派对标签

 对于```
6
Add a
Add a
Vote a
Vote a
Add b
Vote b
```堆栈演变为`[a]`,`[a, a]`,`[a]`,`[]`,`[b]`,`[]`。 两人`a`即使条目的标签相同，也将被视为单独的票据。 该算法从不尝试全局识别账单，因为只有最高位置才重要。 

###最后未完成的讨论

 对于```
3
Add a
Add b
Vote b
```最终堆栈是`[a]`。 投票赞成`b`是有效的，因为`b`是有效的账单，但较旧的账单`a`讨论仍然暂停且尚未结束。 最终的空检查因此打印`No`。 

### 每张完成的账单后清空堆栈

 对于```
6
Add a
Vote a
Add b
Vote b
Add c
Vote c
```每对之后堆栈都会返回空。 每一项新法案都会引发新的讨论，而且从来没有任何被搁置的法案。 该算法接受，因为每个投票都与顶部匹配，并且最终堆栈为空。 

###同一方可以引入嵌套账单

 对于```
4
Add x
Add x
Vote x
Vote x
```两票均有效。 第一个`Vote x`移除内部钞票，露出较旧的钞票`x`法案，第二次投票删除了该法案。 仅存储一组活动方的解决方案将失去这种区别，而堆栈自然会保留未完成账单的数量和嵌套顺序。
