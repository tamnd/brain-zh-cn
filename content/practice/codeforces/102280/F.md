---
title: "CF 102280F-\u041d\u0435\u043e\u0436\u0438\u0434\u0430\u043d\u043d\u0430\u044f\u0437\u0438\u043c\u0430"
description: "笔记本中的每一行仅包含驾驶员的姓氏。 司机在离开车库时写一次姓氏，在返回时写一次姓氏。 笔记本没有告诉我们哪一次是出发，哪一次是回归。"
date: "2026-08-13T15:59:50+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102280
codeforces_index: "F"
codeforces_contest_name: "2010, \u0422\u0440\u0435\u043d\u0438\u0440\u043e\u0432\u043a\u0430 \u0421\u0413\u0410\u0423 aka \u041a\u043e\u043d\u0442\u0435\u0441\u0442 \u043f\u0440\u043e \u043c\u0430\u0440\u0448\u0440\u0443\u0442\u043a\u0438"
rating: 0
weight: 102280
solve_time_s: 146
verified: true
draft: false
---

[CF 102280F - \u041d\u0435\u043e\u0436\u0438\u0434\u0430\u043d\u043d\u0430\u044f \u0437\u0438\u043c\u0430](https://codeforces.com/problemset/problem/102280/F)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 26s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 笔记本中的每一行仅包含驾驶员的姓氏。 司机在离开车库时写一次姓氏，在返回时写一次姓氏。 笔记本没有告诉我们哪一次是出发，哪一次是回归。 

对于完成所有行程的司机来说，姓氏出现的次数为偶数。 仍然被困在某个地方的司机有一次无与伦比的出发，因此这个姓氏出现了奇数次。 任务就是找到那个姓氏。 如果没有不匹配的姓氏，则所需的输出为`FAIL`。 

例如，如果笔记本包含```
Yakubov
Abramov
Yakubov
```然后`Yakubov`有两条记录并且`Abramov`有一个，所以`Abramov`是没有回来的司机。 

的价值`n`可以达到150000，姓氏最多可以包含255个字符。 比较多对记录的算法成本太高。 对于 150000 条记录，二次算法的执行大致如下

 [
 \frac{150000\cdot149999}{2}\约 11.25\cdot10^9
 ]

 比较，远远超出了两秒的限制。 我们只需处理每个记录恒定的次数，即可给出预期的线性时间解决方案。 

有几种边缘情况可能会导致粗心的实施失败。 最小可能的输入是单个记录：```
1
Petrov
```答案是`Petrov`，因为该单个事件不能与另一个记录配对。 

重复的姓氏也必须正确处理。 为了```
5
Ivanov
Ivanov
Ivanov
Ivanov
Ivanov
```答案是`Ivanov`，因为出现 5 次留下了 1 个不匹配的记录。 仅查找恰好出现一次的姓氏的实现会错误地拒绝这种情况。 

姓氏最长可达 255 个字符，因此必须将其视为任意字符串，而不是字符或小数值。 例如，```
1
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
```包含一个最大长度的有效姓氏，并且必须打印该确切的字符串。 

最后，答案是由奇偶性决定的，而不是由记录的顺序决定的。 顺序```
Askerov
Shumacher
Askerov
Abalkin
Abalkin
```具有三个相关对或不匹配的出现，无论这些行出现在何处。 正确答案是`Shumacher`。 

## 方法

 一种直接的方法是获取每个姓氏并搜索另一个可以与其配对的相同姓氏。 一旦找到一对，两条记录都可以被删除，剩下的记录可以识别没有返回的司机。 这是正确的，因为每次完成的旅行都会贡献两个相同的姓氏。 

问题是搜索的成本。 在最坏的情况下，我们可能会检查每条记录的几乎所有其他记录。 和`n = 150000`，这提供了大约 112.5 亿次比较。 虽然每次比较都很简单，但是这个工作量却远远超出了时间限制。 

有用的观察是笔记本条目的实际顺序并不重要。 重要的是每个姓氏出现了多少次。 每个完成的驱动程序都会贡献一个偶数计数，而缺失的返回会将一个计数从偶数更改为奇数。 

我们可以直接用集合来利用这一点。 当姓氏第一次出现时，将其放入集合中。 当它再次出现时，将其删除。 处理输入的任何前缀后，姓氏在迄今为止出现奇数次的时候就位于集合中。 处理完所有记录后，该集合恰好包含总频率为奇数的姓氏。 

在预期的输入条件下，有一个这样的姓氏。 如果该集合恰好包含一个值，那就是答案。 如果为空，则所有记录都已配对并打印`FAIL`。 如果格式错误的输入产生了几个奇数频率的姓氏，则返回`FAIL`也是安全的行为，因为没有唯一的驱动程序可以识别。 

可以使用频率字典实现相同的想法，但切换集更简单，因为我们永远不需要精确的计数。 我们只需要知道当前计数是奇数还是偶数。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n²) | O(n) | 太慢了|
 | 最佳 | O(n) 预期 | O(n) | 已接受 |

 ## 算法演练

 1. 阅读`n`并创建一个名为的空集`odd`。 
2. 一次处理一个姓氏。 如果姓氏不在`odd`，插入它。 如果它已经存在，请将其删除。 这两种情况正好对应于将其出现次数从偶数变为奇数或从奇数变为偶数。 
3. 毕竟`n`记录已处理，检查`odd`。 剩下的每个姓氏都出现过奇数次。 
4. 如果只剩下一个姓氏，则将其打印出来。 这个姓氏有一个不匹配的出现，所以它的司机还没有回来。 
5. 如果集合为空，则打印`FAIL`。 每个姓氏出现偶数次，因此每个笔记本记录都可以与相同的记录配对。 
6. 如果还剩下几个姓氏，则还打印`FAIL`，因为输入无法识别唯一的不匹配驱动程序。 

### 为什么它有效

 不变的是，在处理任意数量的记录后，姓氏属于`odd`恰好当其处理的出现次数为奇数时。 最初，每个计数都为零，因此不变量成立。 读取姓氏会将其奇偶性改变一位。 如果之前的计数为偶数，则插入姓氏，如果之前的计数为奇数，则删除姓氏。 因此，在每条记录之后，不变式仍然成立。 

最后，每个完成所有行程的司机都有偶数个笔记本记录，并且不在集合中。 未返回的车手的记录数为奇数，并保留在该组记录中。 因此，当剩下一个姓氏时，它正是所需的答案。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input())
    odd = set()

    for _ in range(n):
        surname = input().strip()

        if surname in odd:
            odd.remove(surname)
        else:
            odd.add(surname)

    if len(odd) == 1:
        print(next(iter(odd)))
    else:
        print("FAIL")

if __name__ == "__main__":
    solve()
```套装`odd`仅存储当前频率为奇数的姓氏。 成员资格测试以及插入或删除预计为 O(1)，因此处理一条记录需要恒定的预期时间。 

使用`input().strip()`删除留下的换行符`readline()`。 它不会改变姓氏中的字母，因此大小写仍然很重要。 例如，`Ivanov`和`ivanov`是不同的字符串，必须被视为不同的驱动程序。 

不涉及整数算术`n`超出循环计数器，因此整数溢出在 Python 中不是问题。 循环完全运行`n`次，这避免了任何相差一的歧义。 

条件`len(odd) == 1`优于简单地采用任意元素。 后者将隐藏包含多个奇数频率姓氏的格式错误的输入。 空集情况直接对应于请求`FAIL`输出。 

## 工作示例

 ### 示例 1

 第一个示例包含三个记录：```
3
Yakubov
Yakubov
Abramov
```该集合的状态变化如下。 

| 记录| 姓氏 | 行动|`odd`记录后|
 | --- | --- | --- | --- |
 | 1 |`Yakubov`| 插入|`{Yakubov}`|
 | 2 |`Yakubov`| 删除 |`{}`|
 | 3 |`Abramov`| 插入|`{Abramov}`|`Yakubov`出现两次，因此它的两条记录相互抵消。`Abramov`发生一次并保留在集合中，给出输出`Abramov`。 

### 示例 2

 第二个样本是```
7
Askerov
Shumacher
Askerov
Askerov
Shumacher
Abalkin
Abalkin
```国家就是这样演变的。 

| 记录| 姓氏 | 行动|`odd`记录后|
 | --- | --- | --- | --- |
 | 1 |`Askerov`| 插入|`{Askerov}`|
 | 2 |`Shumacher`| 插入|`{Askerov, Shumacher}`|
 | 3 |`Askerov`| 删除 |`{Shumacher}`|
 | 4 |`Askerov`| 插入|`{Shumacher, Askerov}`|
 | 5 |`Shumacher`| 删除 |`{Askerov}`|
 | 6 |`Abalkin`| 插入|`{Askerov, Abalkin}`|
 | 7 |`Abalkin`| 删除 |`{Askerov}`|`Shumacher`出现两次并且`Abalkin`出现两次。`Askerov`出现了 3 次，因此只有一次出现未匹配。 输出是`Askerov`。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) 预期 | 每个姓氏都被处理一次，集合操作预计为 O(1)。 |
 | 空间| O(n) | 在最坏的情况下，许多不同的姓氏可能具有奇数频率并保留在集合中。 |

 和`n`最多 150000，预期的线性时间算法在每个输入行仅执行少量哈希表操作。 这完全在两秒限制的预期算法复杂性之内。 内存使用量随着不同姓氏的数量而增长，而不是随着单独存储的记录数量而增长。 

## 测试用例```python
import sys
import io

def solve():
    input = sys.stdin.readline
    n = int(input())
    odd = set()

    for _ in range(n):
        surname = input().strip()
        if surname in odd:
            odd.remove(surname)
        else:
            odd.add(surname)

    if len(odd) == 1:
        print(next(iter(odd)))
    else:
        print("FAIL")

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    try:
        sys.stdin = io.StringIO(inp)
        sys.stdout = io.StringIO()
        solve()
        return sys.stdout.getvalue().strip()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

# Provided sample 1
assert run(
    """3
Yakubov
Yakubov
Abramov
"""
) == "Abramov", "sample 1"

# Provided sample 2
assert run(
    """7
Askerov
Shumacher
Askerov
Askerov
Shumacher
Abalkin
Abalkin
"""
) == "Askerov", "sample 2"

# Minimum-size input
assert run(
    """1
Petrov
"""
) == "Petrov", "minimum n"

# All records have the same surname, with an odd number of occurrences
assert run(
    """5
Ivanov
Ivanov
Ivanov
Ivanov
Ivanov
"""
) == "Ivanov", "all equal values"

# Maximum valid odd n, all records have the same surname
max_n = 149999
assert run(
    str(max_n) + "\n" + ("Z" * 255 + "\n") * max_n
) == "Z" * 255, "maximum n and maximum surname length"

# No unique unmatched surname, representing the FAIL case
assert run(
    """6
A
B
A
B
C
C
"""
) == "FAIL", "all records paired"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 / Petrov`|`Petrov`| 最小有效输入和单个不匹配记录 |
 | 五份`Ivanov`|`Ivanov`| 重复出现和奇偶校验而不是频率等于一 |
 | 149999份255字姓氏| 同姓 | 最大有效赔率`n`和最大姓氏长度 |
 |`A B A B C C`|`FAIL`| 每次出现都是配对的并且集合变空 |

 ## 边缘情况

 最小情况是```
1
Petrov
```该集合开始为空。`Petrov`被插入，所以在唯一的记录之后该集合是`{Petrov}`。 它的大小是一，算法打印`Petrov`。 

姓氏不必恰好出现一次才能作为答案。 考虑```
5
Ivanov
Ivanov
Ivanov
Ivanov
Ivanov
```第一次出现插入`Ivanov`，第二个将其删除，第三个再次将其插入，第四个将其删除，第五个将其插入。 最终套装包含`Ivanov`，所以答案是`Ivanov`。 这就是为什么跟踪奇偶校验比专门搜索频率 1 更合适。 

全部返回的情况可以表示为```
6
A
B
A
B
C
C
```

`A`被插入和移除，然后`B`被插入和移除，最后`C`被插入和移除。 最终的集合是空的，所以程序打印`FAIL`。 

最大长度姓氏被视为普通的 Python 字符串。 例如，```
1
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz
```产生整个姓氏不变。 该算法不会对姓氏进行索引，也不会对其长度进行任何假设，因此 255 个字符的边界不需要特殊分支。 

记录的顺序也没有影响。 为了```
5
Askerov
Abalkin
Askerov
Abalkin
Shumacher
```无论其位置如何，这两对都会取消。 在前四个记录之后，集合为空，并且`Shumacher`由最后一条记录插入。 结果是`Shumacher`。 

最后，声明的输入大小是奇数。 在故事的有效条件下，每一次完成的旅行都会贡献两条记录，而恰好一次未完成的旅行会额外贡献一条记录，因此必须有一个奇数姓氏。 这`FAIL`分支被保留，因为输出规范明确允许它，并且因为如果输入不满足预期结构，检查最终集大小可以使实现变得稳健。
