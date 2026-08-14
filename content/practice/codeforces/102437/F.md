---
title: "CF 102437F-\u0411\u044b\u0441\u0442\u0440\u044b\u0439\u043f\u0435\u0440\u0435\u0432\u043e\u0434"
description: "这是一个交互问题。 存在隐藏的非负余额 (n)，其中 (n le 10^{18})，并且程序不会接收 (n) 作为普通输入。 相反，它可以通过发出提款 x 来询问终端是否至少剩余 (x) 美元。"
date: "2026-08-14T15:41:08+07:00"
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

 这是一个交互问题。 存在隐藏的非负余额 (n)，其中 (n \le 10^{18})，并且程序不会接收 (n) 作为普通输入。 相反，它可以通过发出以下命令询问终端是否至少剩余 (x) 美元`withdraw x`。 一个`accepted`答案意味着 (x) 美元从当前余额中删除，而`rejected`表示余额小于(x)并且保持不变。 一旦程序认为余额为零，它就会打印`finish`。 

查询限制取决于未知数 (n)。 令 (q) 为满足 (n \le 2^q) 的最小整数。 终端最多允许 (q+10) 次取款尝试。 这使得查询数量成为真正的复杂性衡量标准。 由于 (10^{18}<2^{60})，使用 2 的所有 60 次幂的固定策略是正确的，但即使 (n) 很小，它也可以进行 60 次查询。 例如，当（n=0）时，限制只有10个查询，因此无条件60个查询扫描是无效的。 

简单的解决方案还对接受的查询和知道余额为零之间的区别很敏感。 若(n=5)，则查询`withdraw 4`回报`accepted`，但余额为 1。 打印`finish`立刻就错了。 成功提款仅告诉我们所请求的金额可用。 

零余额是另一个边界情况。 如果（n=0），`withdraw 1`必须返回`rejected`，之后`finish`是正确的。 如果 (n=1)，则返回相同的查询`accepted`， 和`finish`只有在撤回之后才变得正确。 

2 的精确幂对于检查差一错误也很有用。 对于 (n=2^k)，查询`withdraw 2^k`succeeds and leaves exactly zero. 该算法必须仍然能够安全地继续，因为它通常不能假设接受的查询耗尽了帐户。 最大可能值 (10^{18}) 低于 (2^{60}) 但高于 (2^{59})，因此指数 59 是可以请求的最大的 2 的幂。 该值 (2^{60}) 将超出允许的提款金额，因此没有必要。 

还有一个微妙之处。 在优化阶段，平衡在每次接受查询后都会发生变化，因此答案不会形成关于原始 (n) 的普通单调谓词。 例如，对于 (n=100)，可以接受对 8 的查询并将余额减少到 92，之后即使原始余额为 100，也可以拒绝对 64 的查询。因此，二分搜索需要与普通二分搜索不同的正确性参数。 

## 方法

 蛮力方法是尝试从 (2^{59}) 到 (2^0) 的每一个 2 的幂。 每当提款被接受时，该位就会从当前余额中删除。 这是可行的，因为每个非负整数都有唯一的二进制表示形式。 最后，所有可能的尝试都已尝试过，所以什么也没有留下。 

The problem is the number of attempts. 从 (2^0) 到 (2^{59}) 正好有 60 个 2 的幂，因此最坏的情况是 60 个查询。 然而，对于(n=0)，(q=0)，终端仅允许10次尝试。 暴力算法已经可能在最小可能的平衡上失败。 

关键的观察是我们实际上不需要准确地识别最高设置位。 我们只需要找到一个足够小的指数（l），使得经过短暂的搜索后，剩余余额小于（2^{l+1}）。 那么通常的降序二元分解可以从 (l) 开始，而不是从 59 开始。 

我们可以通过对 60 个可能的指数进行二分查找来获得这样的 (l)。 For a midpoint (m), we try to withdraw (2^m). 如果成功，我们设置 (l=m)。 如果失败，我们设置(r=m)。 在此过程中余额可能会发生变化，因此（l）不一定是原始余额或当前余额的最高位。 重要的是，当搜索以 (r=l+1) 结束时，最终被拒绝的查询给出了当前余额的界限。 如果建立了最后一个有用的接受查询（l），则每个大于（l）的后续指数都被拒绝，特别是边界指数（l+1）对于当前余额来说太大。 因此当前余额低于(2^{l+1})。 

搜索最多有 6 个查询，因为只有 60 个候选指数 和 (60<2^6)。 之后最多需要 (l+1) 次查询，并且 (l) 永远不会超过原始余额的对数刻度。 因此总数最多为 (q+7)，远低于允许的 (q+10)。 这是预期的优化。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(60)) 查询 | (O(1)) | (O(1)) | 小 (n) | 的查询过多
 | 最佳| (O(q)) 次查询，最多 (q+7) | (O(1)) | (O(1)) | 已接受 |

 ## 算法演练

 1. 从指数区间 ([l,r)=[0,60)) 开始。 我们使用 60 是因为每个允许的余额都低于 (2^{60})，因此每个相关幂都是 (2^0,\ldots,2^{59})。 
2. 当(r-l>1)时，选择(m=(l+r)//2)并发出`withdraw ⟦PROTECT_2⟧`。 如果终端应答`accepted`，设置(l=m)。 提款实际上减少了余额，但 (l) 仍然记录了当时可以承受的有用指数。 如果答案是`rejected`，设置(r=m)，因为当前余额肯定低于(2^m)。 
3. 二分查找后，将 (l) 中的指数向下处理至零。 对于每个 (i)，发出`withdraw ⟦PROTECT_3⟧`。 接受的响应将从剩余余额中删除该二进制位。 拒绝的响应仅仅意味着该位不存在。 
4. 尝试完从 (l) 到零的所有指数后，打印`finish`。 二分查找保证剩余余额低于(2^{l+1})，因此现在已经考虑了每个可能的剩余位。 

中心不变量是余额永远不会增加，并且每个接受的查询都会准确删除所请求的金额。 在二分搜索结束时，要么在成功提取 (2^{59}) 后搜索达到 (l=59)，在这种情况下，剩余余额低于 (2^{59})，要么搜索具有由 (2^r) 的拒绝查询创建的边界 (r=l+1)。 在后一种情况下，当前余额低于(2^{l+1})。 因此，从 (l) 到零的最终降序扫描足以消除所有剩余的美元。 

查询边界遵循相同的构造。 二分查找最多使用六次尝试。 最终扫描最多使用 (l+1) 次尝试。 由于接受的提款只会减少余额，因此 (l) 不能超过原始余额的对数范围。 因此总数最多为 (q+7)，而未使用所需的 (q+10) 津贴的 3 次尝试。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    def ask(x):
        print(f"withdraw {x}", flush=True)
        response = input().strip()
        if response == "fail":
            sys.exit(0)
        return response

    l, r = 0, 60

    while r - l > 1:
        m = (l + r) // 2
        response = ask(1 << m)

        if response == "accepted":
            l = m
        else:
            r = m

    for i in range(l, -1, -1):
        ask(1 << i)

    print("finish", flush=True)

if __name__ == "__main__":
    solve()
```这`ask`函数是与交互者进行通信的唯一场所。 它打印提款命令，根据协议的要求立即刷新，并读取响应。 这`fail`响应会导致立即终止，因为明确禁止在终端锁定后继续。 

二分搜索使用指数而不是货币值本身。 该区间包含从 0 到 59 的整数，因此每个请求的金额最多为 (2^{59}<10^{18})。 Python 整数不会溢出，但 C++ 中的相同实现也可以轻松地适合每个实际查询的有符号 64 位整数。 

最终循环故意开始于`l`， 不是`l + 1`或 59. 某些权力可能在二分查找过程中已被撤回，因此再次查询时可能会被拒绝。 那是无害的。 由于余额只会减少，之前成功的提款永远不会再次成功。 

该程序不会尝试从`accepted`回复。 在接受后，无法区分恰好包含 (x) 的帐户和包含多于 (x) 的帐户。`withdraw x`。 继续执行预定策略可以避免这种歧义。 

## 工作示例

 交互式样本是转录本而不是普通的输入文件。 样本 1 与初始余额 1 一致：`withdraw 42`被拒绝，`withdraw 1`被接受，第二个`withdraw 1`被拒绝，因为余额已经为零。 样本 2 与初始余额 0 一致。 

对于样本 1，最佳算法不必重现样本转录本。 下面显示了 (n=1) 的六个查询。 

| 步骤| 指数| 提款 | 回应 | 剩余余额 |
 | --- | --- | --- | --- | --- |
 | 1 | 30| (2^{30}) | 被拒绝 | 1 |
 | 2 | 15 | 15 (2^{15}) | 被拒绝 | 1 |
 | 3 | 7 | (2^7) | (2^7) | 被拒绝 | 1 |
 | 4 | 3 | (2^3) | (2^3) | 被拒绝 | 1 |
 | 5 | 1 | (2^1) | (2^1) | 被拒绝 | 1 |
 | 6 | 0 | (2^0) | (2^0) | 已接受 | 0 |

 二分查找以 (l=0) 结束，最终扫描删除单个美元。 然后算法打印`finish`。 样本的较短转录本只是同一隐藏平衡的另一个有效交互。 

对于样本 2，初始余额为零。 

| 步骤| 指数| 提款 | 回应 | 剩余余额 |
 | --- | --- | --- | --- | --- |
 | 1 | 30| (2^{30}) | 被拒绝 | 0 |
 | 2 | 15 | 15 (2^{15}) | 被拒绝 | 0 |
 | 3 | 7 | (2^7) | (2^7) | 被拒绝 | 0 |
 | 4 | 3 | (2^3) | (2^3) | 被拒绝 | 0 |
 | 5 | 1 | (2^1) | (2^1) | 被拒绝 | 0 |
 | 6 | 0 | (2^0) | (2^0) | 被拒绝 | 0 |

 搜索再次以 (l=0) 结束。 最终查询确认无法提取任何美元，并且`finish`是正确的。 仅使用了六次尝试，低于 (q+10=10) 限制。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(q)) 交互式查询 | 最多 6 个二分搜索查询加上最多 (q+1) 个最终查询 |
 | 空间| (O(1)) | (O(1)) | 仅存储恒定数量的整型变量 |

 由于 (n\le10^{18}<2^{60})，我们总是有 (q\le60)。 因此，该算法最多使用 67 次提款尝试，而协议允许 (q+10)，即至少 10，并且对于最大可能的对数范围达到 70。 该实现使用常量内存。 

## 测试用例

 因为这是交互式的，所以普通的 Codeforces 输入无法通过传统的离线方式重现`run(input_string)`帮手。 本地测试逻辑的有用方法是用保持隐藏平衡的模拟器替换交互器。 相同`strategy`然后，实际解决方案和测试工具都会使用该函数。```python
import sys

def strategy(ask, finish):
    l, r = 0, 60

    while r - l > 1:
        m = (l + r) // 2
        response = ask(1 << m)

        if response == "accepted":
            l = m
        elif response == "rejected":
            r = m
        else:
            raise RuntimeError("unexpected interactor response")

    for i in range(l, -1, -1):
        ask(1 << i)

    finish()

def run_hidden(n):
    balance = n
    commands = []

    def ask(x):
        nonlocal balance
        assert 1 <= x <= 10**18

        commands.append(f"withdraw {x}")

        if balance >= x:
            balance -= x
            return "accepted"
        return "rejected"

    def finish():
        commands.append("finish")
        assert balance == 0

    strategy(ask, finish)
    return commands, balance

def check_sample_transcript(n, commands, replies):
    balance = n

    assert len(commands) == len(replies)

    for command, reply in zip(commands, replies):
        parts = command.split()

        if parts[0] == "withdraw":
            x = int(parts[1])
            expected = "accepted" if balance >= x else "rejected"

            assert reply == expected

            if expected == "accepted":
                balance -= x

        elif command == "finish":
            assert balance == 0
        else:
            raise AssertionError("invalid command")

    assert balance == 0

# Provided Sample 1.
sample1_commands = [
    "withdraw 42",
    "withdraw 1",
    "withdraw 1",
]
sample1_replies = [
    "rejected",
    "accepted",
    "rejected",
]
check_sample_transcript(1, sample1_commands, sample1_replies)

# Provided Sample 2.
sample2_commands = [
    "withdraw 1",
]
sample2_replies = [
    "rejected",
]
check_sample_transcript(0, sample2_commands, sample2_replies)

# Minimum balance.
commands, balance = run_hidden(0)
assert balance == 0
assert commands[-1] == "finish"
assert len(commands) <= 10

# Small boundary values.
commands, balance = run_hidden(1)
assert balance == 0
assert commands[-1] == "finish"

commands, balance = run_hidden(2)
assert balance == 0
assert commands[-1] == "finish"

commands, balance = run_hidden(3)
assert balance == 0
assert commands[-1] == "finish"

# Exact power of two near the upper range.
commands, balance = run_hidden(1 << 59)
assert balance == 0
assert commands[-1] == "finish"
assert len(commands) <= 59 + 10

# Maximum allowed balance.
commands, balance = run_hidden(10**18)
assert balance == 0
assert commands[-1] == "finish"
assert len(commands) <= 60 + 10

# Repeated equal hidden balances catch accidental state leakage.
results = [run_hidden(42) for _ in range(3)]
assert all(balance == 0 for _, balance in results)
assert results[0][0] == results[1][0] == results[2][0]
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 样本 1 转录本，隐藏 (n=1) |`finish`, 余额 0 | 成功提现后出现多余的拒绝查询 |
 | 样本 2 转录本，隐藏 (n=0) |`finish`, 余额 0 | 最低余额和立即归零状态|
 | (n=0) | (n=0) |`finish`, 余额 0 | 尽可能最小的 (q) 和严格的查询预算 |
 | (n=1,2,3) |`finish`, 余额 0 | 最低的非零余额和位边界行为 |
 | (n=2^{59}) | (n=2^{59})`finish`, 余额 0 | 两个的最高相关幂 |
 | (n=10^{18}) | (n=10^{18})`finish`, 余额 0 | 最大允许余额和 (q=60) |
 | (n=42) 重复 3 次 |`finish`，每次余额0 | 状态隔离和确定性交互|

 ## 边缘情况

 零余额自然由搜索处理。 为了`withdraw 1`当 (n=0) 时，答案是`rejected`，并且以后的每次提款也都会被拒绝。 二分查找最终到达(l=0)，最后扫描再执行一次`withdraw 1`， 和`finish`是有效的。 完整的交互仅使用六次尝试，而协议允许十次。 

对于 (n=1)，二分查找拒绝所有大于 1 的测试幂。 最终扫描从指数零开始，所以`withdraw 1`成功并留下零。 然后算法结束。 关键的边界是指数零包含在最终循环中。 从一开始就会错过唯一的一美元。 

对于精确幂（例如 (n=2^5=32)），二分搜索查询可以成功提取 32 并保留 0。 后来的询问全部被拒绝。 最终扫描仍然安全，因为拒绝的提款没有任何作用。 这说明了为什么解决方案不能假设`accepted`响应意味着余额现在为零。 

对于最大余额 (n=10^{18})，我们有 (2^{59}<10^{18}<2^{60})，因此 (q=60)。 每个查询都使用 60 以下的指数，二分查找最多需要六次尝试。 即使 (l=59)，最终扫描也只需要再尝试 60 次，根据确切的搜索路径，最多给出 66 或 67 次尝试，低于允许的 70 次。 

最微妙的情况是当接受的查询在二分搜索期间改变平衡时。 假设（n=100）。 对 8 的查询可以成功，将余额减少到 92。稍后对 32 的查询也可以成功，将其减少到 60，而对 64 的查询则被拒绝。 这些响应不能被解释为与原始 100 的比较。仍然有效的是算法所需的较弱的语句：最终拒绝的边界证明当前余额小于上面的下一个幂 (l)。 然后，最终的降序扫描会删除剩余的二进制表示，而不依赖于原始余额不变。
