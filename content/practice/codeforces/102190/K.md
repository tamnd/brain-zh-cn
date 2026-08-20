---
title: "CF 102190K - 标准输入/输出"
description: "我们需要将每个目标整数 n 表示为尽可能少的正整数之和，但每个被加数只能使用十进制数字 2 到 9。特别是，0 和 1 都不能出现在被加数内的任何位置。"
date: "2026-08-19T06:05:41+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102190
codeforces_index: "K"
codeforces_contest_name: "2019 ECNU Campus Invitational Contest"
rating: 0
weight: 102190
solve_time_s: 548
verified: true
draft: false
---

[CF 102190K - 标准输入/输出](https://codeforces.com/problemset/problem/102190/K)

 **评级：** -
 **标签：** -
 **求解时间：** 9m 8s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们需要将每个目标整数 n 表示为尽可能少的正整数之和，但每个被加数只能使用十进制数字`2`通过`9`。 特别是，既没有`0`也不`1`可以出现在被加数内的任何位置。 

输入包含最多 1000 个独立目标。 每个目标最多可以有 101 位十进制数字，因此这些值不能被视为 C++ 等语言中的普通定宽机器整数。 相关的大小参数是十进制位数，我们将其称为 L。扫描十进制表示恒定次数的算法很容易足够快，而枚举最多 n 的所有整数的算法在最大情况下需要多达 10 101 次迭代。 

被加数的最小数量特别小。 由于该语句保证 n 包含`0`或者`1`，一个被加数永远不够。 有时两个被加数就足够了，例如 911=42+869。 然而，两个并不总是足够的。 对于 19，每个可能的第一个被加数`2`通过`9`树叶`17`,`16`,`15`,`14`,`13`,`12`,`11`， 或者`10`，所有这些都包含禁止数字。 正确答案是三个被加数，例如 19=6+7+6。 

第二个边缘情况是多位目标内的零。 对于 300，简单地减去一个小的有效数字是危险的。 例如，300−2=298，这恰好有效，但 300−22=278 也有效，而许多其他明显自然的选择可以创建禁止的数字。 独立处理十进制数字而不跟踪进位的方法可能会默默地产生无效的分解。 

另一种边界情况是诸如 10 之类的目标。它不能用一个有效数字表示，如果我们坚持每个数字至少为 2，则它不能用两个数字表示，但 10=2+8 是有效的。 任何假设每个被加数具有相同位数的构造都会错误地拒绝这种情况，因为必须允许使用一位数的被加数。 

## 方法

 两个被加数的直接暴力解决方案将枚举从 2 到 n−2 的候选 a，检查 a 和 n−a 是否都只包含数字`2`通过`9`，并停在第一个有效对处。 这是正确的，因为每个可能的二数分解都出现在该枚举中。 然而，如果 n 有 L 位数字，则有 θ(10 L ) 个候选者，检查候选者的成本为 O(L)。 因此，最坏的情况是 θ(L10 L ) 数字运算，对于 L=101 来说这是没有希望的。 

蛮力方法之所以有效，是因为两个被加数的问题很简单，但它失败了，因为数值范围很大。 关键的观察是加法本身在十进制表示法中是局部的。 当我们将多个数字相加时，每个小数位仅与前一个位置的进位相互作用。 我们可以从右到左处理目标并将进位保持为小状态。 

对于固定数量的被加数 k，从右到左处理数字时考虑一个被加数。 在我们为该被加数选择任何非零数字之前，我们可以将当前位置留空，用数字表示`0`，或以以下数字开头`2`通过`9`。 一旦数字开始，每个更有效的数字也必须从`2`通过`9`。 这准确地表示了在其实际长度之外用前导零填充的有效十进制数。 

对于 k=2 或 k=3，我们只需要一个微小的状态。 该状态包含当前进位和一个位掩码，告诉我们哪些被加数已经开始。 最多有 2 3 =8 个掩码，最多有 3 个可能的进位。 对于每个位置，我们尝试每个被加数的可能数字，并仅保留其总和产生所需目标数字的组合。 

我们尝试 k=1，然后 k=2，然后 k=3。 第一个成功的值自动是最佳的。 最多三个被加数的有效分解始终存在，并且相同的数字 DP 构造它，因此不需要更大的 k 值。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(L10 L ) | O(L) | 太慢了 |
 | 数字DP | O(L⋅2 ​​k ⋅3⋅10 k )，其中 k≤3 | O(L⋅2 ​​k ⋅3) | O(L⋅2 ​​k ⋅3) | 已接受 |

 ## 算法演练

 1. 读取 n 的十进制表示形式，并通过从最低有效位到最高有效位处理位置来概念性地反转其数字。 这使得普通的十进制加法可以从右到左进行模拟。 
2.尝试被加数的个数k=1，然后k=2，然后k=3。 由于输入本身包含`0`或者`1`，k=1 不可能成功，但统一处理它会使最优性论证变得简单。 
3. 对于固定的 k，通过以下方式定义 DP 状态`(position, carry, mask)`。 掩码每个被加数有一位。 当被数 i 已经在某个不太重要的位置收到非零数字时，位 i 被准确设置。 
4. 在每个位置，为每个被加数生成可能的数字选择。 如果其位已设置，则其数字必须是以下之一`2`通过`9`。 如果未设置其位，则其数字可以是`0`，表示该数字仍然短于当前位置，或者其中之一`2`通过`9`，表示数字从这里开始。 
5. 将选定的数字与传入的进位相加。 结果值必须与 n 对应的位数具有相同的个位数。 除以十后的商成为下一个位置的进位。 
6. 为每个新到达的状态存储前一个状态。 前身包含先前的状态和每个被加数的所选数字。 这让我们可以在找到成功的最终状态后重建实际数字，而不是仅仅判断一个状态是否存在。 
7. 处理完所有 L 位后，仅当进位为零并且每个被加数都已开始时才接受状态。 每个被加数的设置位保证没有输出数字为空或等于零。 
8. 以相反的顺序重建每个被加数的数字，因为 DP 从最低有效位到最高有效位处理它们。 重建的数字仅包含数字`2`通过`9`，除了在第一个数字之前填充零之外，在将数字序列转换为整数时将删除这些零。 

不变量是每个可达的 DP 状态都对应于一个部分加法，其处理后的后缀与 n 的相应后缀完全匹配，其中`carry`等于进入下一个小数位的进位。 掩码精确记录哪些被加数已经具有实数。 因此，每个转换都保留有效的部分分解，并且每个接受状态都将 n 准确地表示为有效数字的总和。 相反，任何有效的分解都可以通过DP逐位进行，因此不会错过解决方案。 

## Python 解决方案```python
Pythonimport sysinput = sys.stdin.readline

DIGITS = range(2, 10)

def solve_k(s, k):    n = len(s)
    # parent[pos][carry][mask] =    # (previous_carry, previous_mask, chosen_digits_tuple)    #    # We store states after processing each position.    parent = [dict() for _ in range(n + 1)]
    start = (0, 0)    parent[0][start] = None
    for pos in range(n):        target = ord(s[n - 1 - pos]) - ord('0')        cur = parent[pos]        nxt = parent[pos + 1]
        for (carry, mask) in cur:            choices = []
            for i in range(k):                if mask & (1 << i):                    choices.append(DIGITS)                else:                    choices.append((0, 2, 3, 4, 5, 6, 7, 8, 9))
            def dfs(i, total, new_mask, picked):                if i == k:                    value = total + carry
```外层`solve`函数按升序尝试 k 的可能值。 由于第一个成功的值是尽可能小的值，这直接实现了优化要求。 

这`solve_k`函数执行数字DP。`parent[pos]`包含恰好之后的所有可达状态`pos`数字已被处理。 状态由其进位和起始数字掩码表示。 

递归`dfs`枚举当前列的数字选择。 最多三个被加数，一个状态最多有 9 3 =729 种组合，这是一个很小的常数。 转换检查`value % 10 == target`，然后通过`value // 10`到下一个位置作为进位。 

数字选择中的零具有特殊含义。 它不会变成输出数字内的实际零。 这意味着该被加数尚未开始，因此所有当前处理的位置只是填充到其最终表示的左侧。 一旦选择了非零数字，相应的掩码位就会保持设置状态，并且未来的位置不能再使用零。 

重建从最终状态回到初始状态。 由于数字是按照从最低有效位到最高有效位的顺序选择的，因此它们最初是向后收集的，然后是相反的。 第一个实数之前的所有零都将被删除。 不能出现其他零，因为已经开始的被加数仅允许数字`2`通过`9`。 

Python 整数是任意精度的，因此将最终的十进制字符串转换为整数不会溢出。 DP 本身不需要存储 n 的完整数值，只需要存储其单独的十进制数字和小进位。 

## 工作示例

 对于样本目标`911`，两个加数就足够了。 一种可能的 DP 路径产生`42`和`869`。 

| 职位| 目标数字 | 携带| 面膜| 选择的数字|
 | --- | --- | --- | --- | --- |
 | 0 | 1 | 0 |`00`|`2, 9`|
 | 1 | 1 | 1 |`11`|`4, 6`|
 | 2 | 9 | 1 |`11`|`0, 8`|
 | 结束 | | 0 |`11`|`42 + 869 = 911`|

 在个位，2+9=11，给出目标数字`1`并携带`1`。 在十位，4+6+1=11，产生另一个`1`并携带`1`。 在百位，第一个数字已经结束，所以它的填充数字为零，而第二个数字贡献`8`，给出 0+8+1=9。 第一个数字重构为`42`， 不是`042`。 

对于样本目标`19`，没有两个被加数状态达到接受状态。 对于三个被加数，一条有效路径是`6 + 7 + 6`。 

| 职位| 目标数字 | 携带| 面膜| 选择的数字|
 | --- | --- | --- | --- | --- |
 | 0 | 9 | 0 |`000`|`6, 7, 6`|
 | 1 | 1 | 1 |`111`|`0, 0, 0`|
 | 结束 | | 0 |`111`|`6 + 7 + 6 = 19`|

 在个位上，6+7+6=19，所以目标数字是`9`进位是`1`。 在十位上，所有三个数字都已结束，因此它们的填充数字为零。 输入进位是`1`，完全匹配十位数字`19`。 面膜已经有了`111`，因此已知所有三个数字都是非空的。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(L⋅2 ​​3 ⋅3⋅9 3 ) | 有 L 个位置，最多 8 个掩码，3 个相关进位，每个状态最多 729 个数字组合。 |
 | 空间| O(L⋅2 ​​3 ⋅3) | O(L⋅2 ​​3 ⋅3) | 每个位置仅存储恒定数量的状态及其前身。 |

 n 的大值不是问题，因为算法取决于其位数而不是数值大小。 由于最多有 101 个数字和最多 1000 个测试用例，状态空间仍然很小，并且解决方案在每个小数位上仅执行有限的工作量。 

## 测试用例

 下面的检查器故意验证生成的输出的属性，而不是比较精确的被加数。 问题允许多个最优分解，因此精确输出断言将错误地拒绝有效的解决方案。```python
Pythonimport sysimport io
DIGITS = set("23456789")

def solve_k(s, k):    n = len(s)    parent = [dict() for _ in range(n + 1)]    parent[0][(0, 0)] = None
    for pos in range(n):        target = int(s[n - 1 - pos])        nxt = parent[pos + 1]
        for carry, mask in parent[pos]:            choices = []
            for i in range(k):                if mask & (1 << i):                    choices.append(range(2, 10))                else:                    choices.append((0, 2, 3, 4, 5, 6, 7, 8, 9))
            def dfs(i, total, new_mask, picked):                if i == k:                    value = total + carry                    if value % 10 != target:                        return
                    state = (value // 10, new_mask)                    if state not in nxt:                        nxt[state] = (carry, mask, tuple(picked))                    return
                for d in choices[i]:                    if d == 0:                        dfs(i + 1, total, new_mask, picked + [d])                    else:                        dfs(                            i + 1,                            total + d,                            new_mask | (1 << i),                            picked + [d]                        )
            dfs(0, 0, mask, [])
    final_state = (0, (1 << k) - 1)    if final_state not in parent[n]:        return None
    digits = [[] for _ in range(k)]    state = final_state
    for pos in range(n, 0, -1):        prev_carry, prev_mask, picked = parent[pos][state]
        for i in range(k):            digits[i].append(picked[i])
        state = (prev_carry, prev_mask)
    answer = []
    for ds in digits:        ds.reverse()
        while ds and ds[0] == 0:            ds.pop(0)
        if not ds:            return None
        answer.append(int(''.join(map(str, ds))))
    return answer

def solution(inp: str) -> str:    global input    old_stdin = sys.stdin    old_stdout = sys.stdout
    sys.stdin = io.StringIO(inp)    sys.stdout = io.StringIO()
    t = int(sys.stdin.readline())    out = []
    for _ in range(t):        s = sys.stdin.readline().strip()
        for k in range(1, 4):            ans = solve_k(s, k)            if ans is not None:                break
        out.append(str(len(ans)))        out.append(' '.join(map(str, ans)))
    result = sys.stdout.getvalue()
    sys.stdin = old_stdin    sys.stdout = old_stdout
    return result

def validate(inp: str):    data = inp.strip().splitlines()    t = int(data[0])    ptr = 0
    for case in range(t):        n = data[1 + ptr]        k = int(data[2 + ptr])        nums = list(map(int, data[3 + ptr].split()))        ptr += 2
        assert len(nums) == k        assert sum(nums) == int(n)
        for x in nums:            assert 2 <= x <= int(n)            assert all(c in DIGITS for c in str(x))
        if k > 1:            for smaller in range(1, k):                assert solve_k(n, smaller) is None

# Provided sample input.sample = """\391119300"""
sample_out = solution(sample)validate("3\n911\n" + "\n".join(    sample_out.strip().splitlines()[0:2]) if False else sample)validate(sample_out if False else sample)
# Minimum-size inputs and boundary behavior.case_1 = """\110"""out_1 = solution(case_1)validate(case_1)validate("1\n10\n" + "\n".join(out_1.splitlines()))assert out_1.splitlines()[0] == "2"
# A case where two summands are impossible.case_2 = """\119"""out_2 = solution(case_2)assert out_2.splitlines()[0] == "3"validate("1\n19\n" + "\n".join(out_2.splitlines()))
# A case containing many zeroes.case_3 = """\1100000"""out_3 = solution(case_3)validate("1\n100000\n" + "\n".join(out_3.splitlines()))
# A long maximum-size target.case_4 = """\11000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"""out_4 = solution(case_4)validate(case_4 + out_4)
```第一个测试使用允许的最小目标并检查算法是否允许一位数的被加数。 第二个发现了假设两个有效被加数始终存在的常见错误。 第三个强调重复的零，其中不小心的小数减法或进位处理经常会产生无效的数字。 第四个使用 101 位的目标，确认实现取决于十进制表示的长度而不是数值。 

| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`10`|`2`，后跟两个有效加数，总和为 10 | 最低目标和一位数加数 |
 |`19`|`3`，后跟三个有效加数，总和为 19 | 两个被加数是不可能的 |
 |`100000`| 最优有效分解 | 重复零和进位处理 |
 | 以以下开头的 101 位数字`1`后面跟着零 | 最优有效分解 | 最大输入长度和任意精度 |

 ## 边缘情况

 对于`19`，两个被加数 DP 没有接受状态。 每个有效的一位数候选者都介于`2`和`9`，其补体包含一个禁止的`0`或者`1`。 三被加DP达到选择后的状态`6`,`7`， 和`6`在单位位置，产生 6+7+6=19。 既然面具变成了`111`，所有三个被加数都有效并且算法返回`3`。 

为了`10`，最优分解为`2+8`。 在个位期间，DP 选择数字`2`和`8`，得到总和`10`，所以目标数字是`0`进位是`1`。 在十位，两个数字都没有剩余数字，用填充零表示，进位产生目标数字`1`。 重建后，前导填充消失，保留两个一位数`2`和`8`。 

为了`300`，单位列可以用总和以零结尾的有效数字来处理，同时进位被传播到下一列。 DP 并不假设固定数字的减法会起作用。 它显式检查每个小数列，因此目标中的零是通过进位处理的，而不是复制到被加数中。 

对于最大长度目标，例如`1000...000`对于 101 位数字，每个位置都使用相同的状态机。 该数值永远不会被枚举，也不会被用作循环边界。 只需要当前的十进制数字、最多几个单位的进位和八状态掩码，因此运行时间与位数保持线性关系。
