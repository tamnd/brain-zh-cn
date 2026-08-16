---
title: "CF 102437F-\u0411\u044b\u0441\u0442\u0440\u044b\u0439\u043f\u0435\u0440\u0435\u0432\u043e\u0434"
description: "这是一个交互问题。 没有包含帐户余额的普通输入。 交互者秘密选择一个初始余额（n），其中（0 le n le 10^{18}），我们的程序必须发现足够的信息来转移整个余额。"
date: "2026-08-16T09:33:40+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102437
codeforces_index: "F"
codeforces_contest_name: "\u0418\u043d\u0442\u0435\u0440\u043d\u0435\u0442-\u043e\u043b\u0438\u043c\u043f\u0438\u0430\u0434\u044b, \u0421\u0435\u0437\u043e\u043d 2019-2020, \u0427\u0435\u0442\u0432\u0451\u0440\u0442\u0430\u044f \u043a\u043e\u043c\u0430\u043d\u0434\u043d\u0430\u044f \u043e\u043b\u0438\u043c\u043f\u0438\u0430\u0434\u0430, \u0443\u0441\u043b\u043e\u0436\u043d\u0435\u043d\u043d\u0430\u044f \u043d\u043e\u043c\u0438\u043d\u0430\u0446\u0438\u044f"
rating: 0
weight: 102437
solve_time_s: 247
verified: false
draft: false
---

[CF 102437F - \u0411\u044b\u0441\u0442\u0440\u044b\u0439 \u043f\u0435\u0440\u0435\u0432\u043e\u0434](https://codeforces.com/problemset/problem/102437/F)

 **评级：** -
 **标签：** -
 **求解时间：** 4m 7s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 这是一个交互问题。 没有包含帐户余额的普通输入。 交互者秘密地选择一个初始余额（n），其中（0 \le n \le 10^{18}），我们的程序必须发现足够的信息来转移整个余额。 唯一的查询是`withdraw x`。 如果当前余额至少为 (x)，则交互者回答`accepted`并删除 (x)。 否则它会回答`rejected`并保持余额不变。 我们可以通过打印来完成`finish`，但只有当隐藏余额实际上为零时才被接受。 官方声明确认了这个交互协议和(q+10)个查询的限制，其中(q)是满足(n\le2^q)的最小整数。 

挑战不仅在于找到 (n)，而且还在于以极少的破坏性比较来找到它。 由于 (n) 可以大到 (10^{18})，因此每美元执行一次取款的策略可能需要 (10^{18}) 次查询。 即使是整个区间 ([0,10^{18}]) 上的普通二分搜索也将使用大约 60 个查询，当 (n) 很小时，这已经太多了。 例如，如果(n=1)，则(q=0)，因此最多允许尝试10次。 

有两种边缘情况值得特别注意。 如果（n=0），正确的相互作用可以是`withdraw 1`，接收`rejected`， 其次是`finish`。 盲目地开始测试 2 的大幂的策略会浪费许多查询并超出 (q=0) 的限制。 如果 (n=1)，则第一个`withdraw 1`被接受，但这本身并不能证明该帐户是空的。 一秒钟`withdraw 1`有必要区分 (n=1) 和 (n\ge2)。 例如，示例交互```
withdraw 42
withdraw 1
withdraw 1
finish
```有回复```
rejected
accepted
rejected
```证明隐藏余额恰好为 1。第一次拒绝给出 (n<42)，第一次接受的提款给出 (n\ge1)，第二次拒绝证明在取出 1 美元后什么都没有剩下。 官方样本正是包含这种交互。 

## 方法

 最直接的方法就是反复尝试`withdraw 1`。 每次成功的查询都会删除一美元，因此显然是正确的，最终帐户会变空。 问题在于操作次数。 对于 (n=10^{18})，这需要恰好 (10^{18}) 次尝试，而交互器仅允许 (q+10)，其中 (q=60)。 这种方法不太可行。 

一个更有前途的想法是使用二的幂。 如果我们以某种方式知道平衡位于 (2^k) 和 (2^{k+1}-1) 之间，那么提取 (2^{k-1},2^{k-2},\ldots,1) 最多可在 (k) 个查询中提取其剩余的二进制表示。 缺少的部分是如何发现（k）而不花费（k）更多查询来测试二的幂。 

关键的观察是，成功的提款可以被视为与原始余额的比较。 假设我们已经提取了 (s) 美元，因此经常账户包含 (n-s) 美元。 要询问原始余额是否至少达到某个目标 (T)，我们可以请求`withdraw T-s`。 如果接受，则(n-s\ge T-s)，相当于(n\ge T)。 查询成功后，提取的总金额正好变为（T）。 如果被拒绝，总提款金额仍为(s)，我们得知(n<T)。 

这让我们可以对不超过 (n) 的两个最大幂的指数执行二分搜索，而每次成功的比较只是将已提取的金额移动到测试的幂。 由于只有 60 个可能的指数，因此只需要大约 6 次查询即可找到该指数。 之后，剩余余额小于已知的最大2的幂，因此可以直接提取其二进制表示。 

暴力方法每美元花费一次查询，而最佳方法花费恒定数量的查询来定位大小，然后每个二进制数字花费一次查询。 这种区别至关重要，因为查询限制本身在 (n) 中是对数的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (O(n)) 查询 | (O(1)) | (O(1)) | 太慢了 |
 | 最佳 | (O(\log n)) 查询 | (O(1)) | (O(1)) | 已接受 |

 ## 算法演练

 1. 索要一美元。 如果交互者拒绝它，则隐藏余额为零，因此打印`finish`。 这处理单个查询中的 (n=0) 情况。 
2. 如果第一美元被接受，请再索取一美元。 如果被拒绝，原来的余额正好是1，所以打印`finish`。 在两次接受的一美元提款之后，我们知道 (n\ge2) 和恰好两美元已经被删除。 
3. 维护`paid`，已提取的总金额。 最初`paid = 2`。 现在我们找到满足 (2^f\le n) 的最大指数 (f)。 由于 (n\le10^{18}<2^{60})，搜索 1 到 59 的指数就足够了。 
4. 对指数进行二分查找。 对于候选指数 (m)，令`target = 2^m`。 如果`target <= paid`，那么 (n\gepaid\getarget) 是已知的，因此不需要查询。 否则要求`withdraw target - paid`。 已接受的响应证明（n\ge 目标），并且我们更新`paid`到`target`。 被拒绝的响应证明 (n<target)，因此候选指数太大。 
5. 指数搜索后，`paid = 2^f`和 (2^f\le n<2^{f+1})。 因此，剩余余额小于 (2^f)。 按降序测试幂 (2^{f-1},2^{f-2},\ldots,1)。 每当接受查询时，该二进制数字就会出现并从帐户中删除。 拒绝意味着该数字不存在。 
6. 一旦测试了所有这些幂，(2^f) 以下的每个可能的二进制数字都已被删除。 账户是空的，所以打印`finish`。 

### 为什么它有效

 中心不变量是`paid`始终是从原始帐户中删除的总金额。 因此当前余额为 (n-\text{paid})。 每当我们想要测试是否 (n\ge T) 和 (T>\text{paid}) 时，查询`withdraw T-paid`在 (n-\text{paid}\ge T-\text{paid}) 时被接受，即 (n\ge T)。 成功的查询也会改变`paid`到(T)，保持不变量。 

指数搜索因此找到不超过(n)的二的最大幂。 一旦撤回该权力，剩余金额将严格小于该权力。 按降序测试所有较小的幂正是二进制表示的贪婪构造，因此最终剩余的每一美元都会被转移。 在测试完 1 的最终幂后，任何查询都不能留下非零余额。 

尝试次数也在特殊的交互范围内。 最多有两个初始查询、最多六个指数搜索查询和最多 59 个二进制数字查询。 因此最多有 67 次尝试。 对于最大可能的余额 (q=60)，因此限制为 70。对于较小的余额，指数搜索仍然只花费恒定数量的查询，而最终的二进制提取最多花费 (q) 个查询，留下所需的 10 个查询的余量。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def ask(x):
    print(f"withdraw {x}", flush=True)
    response = input().strip()

    if response == "fail":
        sys.exit(0)

    return response == "accepted"

def finish():
    print("finish", flush=True)

# First distinguish n = 0 and n = 1.
if not ask(1):
    finish()
    sys.exit(0)

if not ask(1):
    finish()
    sys.exit(0)

# Two dollars have already been withdrawn.
paid = 2

# Find the largest f such that 2^f <= n.
lo = 1
hi = 59

while lo < hi:
    mid = (lo + hi + 1) // 2
    target = 1 << mid

    if target <= paid:
        lo = mid
    else:
        if ask(target - paid):
            paid = target
            lo = mid
        else:
            hi = mid - 1

f = lo

# Extract the remaining balance bit by bit.
power = 1 << (f - 1)

while power >= 1:
    if ask(power):
        pass
    power >>= 1

finish()
```这`ask`函数是与交互器进行通信的唯一场所。 它打印命令，立即刷新，并读取回复。 一个`fail`响应必须立即终止程序，因为继续下去会违反协议。 

前两个调用`ask(1)`很特别。 第一个区分零和正余额。 第二个将一个与至少两个区分开来。 两次调用成功后，`paid`正好是 2，这给了我们一个已经从原始余额中扣除的已知金额。 

在指数搜索期间，表达式`target - paid`始终为正，因为仅在以下情况下才执行查询`target > paid`。 它最多也是 (2^{59})，低于允许的最大查询量 (10^{18})。 Python 整数具有任意精度，因此不存在溢出问题。 

最终循环不需要为当前帐户余额维护单独的变量。 每次成功的断电都会删除该二进制数字。 由于功率是从最大到最小进行测试的，因此在每个点上测试的功率都不大于剩余的可能平衡范围。 

该程序没有要解析的普通输入，因为这是一项交互式任务。 所需的`input = sys.stdin.readline`按照 Python 实现约定的要求，声明仍用于读取交互器响应。 

## 工作示例

 ### 示例 1

 样本交互对应于恰好为 1 的初始余额。其记录为：```
withdraw 42
rejected
withdraw 1
accepted
withdraw 1
rejected
finish
```我们的实现通过略有不同的记录得出了相同的结论，因为它是从检查一美元开始的。 

| 步骤| 查询 | (n=1) | 的响应`paid`步骤后| 意义|
 | ---| ---| ---| ---| ---|
 | 1 |`withdraw 1`|`accepted`| 1 | (n\ge1) | (n\ge1) |
 | 2 |`withdraw 1`|`rejected`| 1 | (n<2)，因此 (n=1) |
 | 3 |`finish`|`OK`| 1 | 账户为空 |

 该跟踪说明了为什么第二个一美元查询是必要的。 单次接受的提款无法区分 (n=1) 和 (n=2) 或任何更大的正余额。 

### 示例 2

 第二个样本对应于初始余额为零：```
withdraw 1
rejected
finish
```| 步骤| 查询 | (n=0) | 的响应`paid`步骤后| 意义|
 | ---| ---| ---| ---| ---|
 | 1 |`withdraw 1`|`rejected`| 0 | (n<1)，因此 (n=0) |
 | 2 |`finish`|`OK`| 0 | 账户为空 |

 这是关键的小值案例。 始终执行长的二次方搜索的策略将超出此处的 (q+10=10) 查询限制，而所提出的算法在一次撤回尝试后停止。 

### 一个更大的例子

 考虑 (n=13)。 前两次1美元提款留下11美元并设定`paid=2`。 在指数搜索过程中，算法最终证明 (2^3=8\le13) 但是 (2^4=16>13)。 与 8 的成功比较提取了剩余的 6 美元`paid=8`。 该帐户现在有 5 美元。 

最终二进制提取测试4、2、1。4查询成功，剩下1块钱； 2 的查询被拒绝； 查询1成功。 总提款金额为（8+4+1=13），所以`finish`是安全的。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O(\log n)) 交互式查询 | 恒定大小的指数搜索后跟每个二进制数字一个查询 |
 | 空间| (O(1)) | (O(1)) | 仅存储几个整数变量和当前交互器响应 |

 余额以 (10^{18}) 为界，因此最多有 60 个相关的二进制位置。 最坏情况下的提款尝试次数最多为 67 次，低于 (n) 接近 (10^{18}) 时允许的 70 次尝试。 对于较小的 (n)，最终二进制查询的数量随着 (q) 的增加而减少，而指数搜索仍以 6 个查询为界，因此在整个范围内满足 (q+10) 限制。 

## 测试用例

 由于原始任务是交互式的，因此它的样本不是普通的 stdin/stdout 测试用例。 一个有用的离线测试工具必须模拟隐藏余额并验证每次生成的提款是否合法，最终余额为零，并且尝试次数不超过（q+10）。 以下测试反映了提交的算法。```python
import sys
import io

def offline_commands(n):
    balance = n
    commands = []

    def ask(x):
        nonlocal balance

        assert 1 <= x <= 10**18
        commands.append(("withdraw", x))

        if balance >= x:
            balance -= x
            return True
        return False

    if not ask(1):
        commands.append(("finish",))
        return commands, balance

    if not ask(1):
        commands.append(("finish",))
        return commands, balance

    paid = 2

    lo = 1
    hi = 59

    while lo < hi:
        mid = (lo + hi + 1) // 2
        target = 1 << mid

        if target <= paid:
            lo = mid
        else:
            if ask(target - paid):
                paid = target
                lo = mid
            else:
                hi = mid - 1

    f = lo
    power = 1 << (f - 1)

    while power >= 1:
        ask(power)
        power >>= 1

    commands.append(("finish",))
    return commands, balance

def run(n):
    commands, balance = offline_commands(n)

    q = 0 if n == 0 else (n - 1).bit_length()
    attempts = sum(1 for command in commands if command[0] == "withdraw")

    assert balance == 0
    assert commands[-1] == ("finish",)
    assert attempts <= q + 10

    return commands

def check_sample_1():
    balance = 1
    transcript = [
        ("withdraw", 42, False),
        ("withdraw", 1, True),
        ("withdraw", 1, False),
    ]

    for _, x, accepted in transcript:
        actual = balance >= x
        assert actual == accepted

        if actual:
            balance -= x

    assert balance == 0

def check_sample_2():
    balance = 0
    transcript = [
        ("withdraw", 1, False),
    ]

    for _, x, accepted in transcript:
        actual = balance >= x
        assert actual == accepted

        if actual:
            balance -= x

    assert balance == 0

check_sample_1()
check_sample_2()

# Minimum-size cases.
assert run(0)[-1] == ("finish",), "zero balance"
assert run(1)[-1] == ("finish",), "one dollar"

# Boundary between q = 1 and q = 2.
assert run(2)[-1] == ("finish",), "exact power of two"
assert run(3)[-1] == ("finish",), "just above a power of two"

# Large power of two, where the exponent reaches 59.
assert run(1 << 59)[-1] == ("finish",), "2^59"

# Maximum allowed initial balance.
assert run(10**18)[-1] == ("finish",), "maximum balance"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | (n=0) | (n=0) |`finish`提款被拒绝后 | 最低余额和（q=0）查询限制 |
 | (n=1) | (n=1) |`finish`区分后第二次提款| 最小正余额和差一边界 |
 | (n=2) | (n=2) |`finish`完全撤回两个确切的权力| 精确的二次方处理 |
 | (n=3) | (n=3) |`finish`提取二进制表示后 (11_2) | 紧邻 2 的幂以上的值 |
 | (n=2^{59}) | (n=2^{59})`finish`| 最高相关二进制指数 |
 | (n=10^{18}) | (n=10^{18})`finish`| 最大允许余额及查询金额边界 |

 ## 边缘情况

 对于 (n=0)，确切的输入状态是隐藏余额为零，因此第一个命令是`withdraw 1`。 交互器拒绝它，因为 (0<1)，程序立即打印`finish`。 仅进行了一次尝试，而 (q=0) 允许进行十次。 

对于 (n=1)，交互作用开始于`withdraw 1`，被接受并留零。 程序此时不能简单地完成，因为每个 (n\ge1) 也会发生相同的响应。 它发送`withdraw 1`再次，收到`rejected`，现在知道原来的余额还不到二。 结合第一个接受的提款，这证明了（n=1）。 程序在两次尝试后完成，远低于 (q+10=10)。 

对于 (n=2)，两个初始的一美元查询都被接受，所以`paid=2`并且真实账户是空的。 指数搜索知道指数 1 已经有效，因为`paid`本身等于 (2^1)。 它不发出零值查询。 剩余的功率测试资金空了，全部被拒绝，之后`finish`是正确的。 这避免了实现意外尝试的常见边界错误`withdraw 0`。 

对于 (n=3)，前两次取款再次建立`paid=2`。 指数搜索找到 (f=1)，因为 (2\le3<4)。 剩余余额为1，所以最终`withdraw 1`成功并将其删除。 二进制提取将原始值表示为 (2+1)，完全符合要求。 

对于 (n=2^{59})，指数搜索达到允许的最大幂 (2^{59})。 成功比较后，`paid`等于全部余额。 最终测试使用从 (2^{58}) 到 1 的幂，所有这些都被拒绝。 本例在不查询 (2^{60}) 的情况下执行上指数边界，这将超出允许的提款金额 (10^{18})。 

对于(n=10^{18})，最大可能的初始余额为(q=60)。 该算法首先提取两美元，使用最多 6 个附加查询来定位最高相关功率，然后使用最多 59 个二进制数字查询。 即使在最差的交互中，最多也有 67 次提款尝试，低于允许的值 (q+10=70)。 每次单独提款的实施也保持在允许的最大值 (10^{18}) 之内。
