---
title: "CF 102443H - 第九行星"
description: "寄存器从 a 开始，必须以 b 结束。 事件只有两种。 加法将寄存器增加 9 的正倍数，而删除则删除一些前导小数位，并且每个删除的数字必须为 1。"
date: "2026-08-09T18:09:37+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102443
codeforces_index: "H"
codeforces_contest_name: "2019-2020 Russia Team Open, High School Programming Contest (VKOSHP 19)"
rating: 0
weight: 102443
solve_time_s: 479
verified: true
draft: false
---

[CF 102443H - 第九行星](https://codeforces.com/problemset/problem/102443/H)

 **评级：** -
 **标签：** -
 **求解时间：** 7m 59s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 寄存器开始于`a`并且必须结束于`b`。 事件只有两种。 加法将寄存器增加 9 的正倍数，而删除则删除一些前导小数位，并且每个删除的数字都必须是`1`。 输出是最多 1000 个此类事件的任何有效序列。 每个中间寄存器值最多只能为 10 18。 

有用的量是模 9 的余数。加上 9x 不会改变它。 如果我们删除`y`从十进制数开始，删除的前缀等于`y`模 9，10 的每个幂也等于 1 模 9。因此删除`y`数字精确地减少余数`y`模 9。这是构造背后的核心算术属性。 

的界限`a`和`b`足够小，其十进制表示最多有 10 位数字。 中间值限制要大得多，为 10 18，因此我们有空间临时创建位数更多的数字。 操作限制为 1000，这排除了任何通过长操作序列的搜索，但下面的构造只需要几十个操作。 

有几种边缘情况可能会使看似合理的构造失败。 为了`0 0`，正确答案很简单`Stable`其次是`0`，因为不需要任何事件。 总是发出正加法的程序会不必要地更改寄存器。 

为了`1 9`，这两个值模 9 的余数不同。仅添加 9 无法改变`1`进入`9`。 一种有效的结构是样本的`+ 2`，这会改变`1`到`19`， 其次是`- 1`，这会删除领先的`1`和叶子`9`。 一个仅检查是否`a <= b`然后添加`(b-a)/9`会错误地拒绝此案。 

案例`0 1`是另一个有用的边界。 没有直接加法，因为 1 不是 9 的倍数。我们可以重复创建一个前导`1`并删除它，一步一步地改变余数，最终达到 1。一种结构是`0 -> 18 -> 8 -> 17 -> 7 -> ... -> 11 -> 1`。 临时值比最终值大，但仍远低于 10 18。 

最后，诸如以下的值`1000000000`需要小心，因为它们有 10 位数字。 创建具有太多前导数字的数字的结构可能会超出 10 18 的限制。 最优结构故意使用最多 18 位的重新单位，其值低于 1.12⋅10 17。 

## 方法

 暴力方法可以将每个可能的寄存器值建模为一个状态，并尝试每个状态的两种操作类型。 这会立即失败，因为添加有大量可能的参数。 即使从零开始，也有

 ⌊ 9 10 18 ​ ⌋=111111111111111111

 尊重中间值界限的可能的正添加。 搜索操作序列更糟糕：如果我们人为地将自己限制为每一步只有两个固定选择，那么深度 1000 的搜索将已经包含 2 1000 个序列。 实际操作集要大得多，因此暴力破解并不是一个有意义的选择。 

蛮力在概念上是有效的，因为它最终会发现一个有效的序列（如果存在）。 有用的观察是我们根本不需要搜索添加内容。 我们可以通过代数来选择它们。 

假设当前值为`v`，并让它有`d`小数位。 定义

 t=(v−1)mod9。 

现在考虑

 T=10d+t。 

数量`T`以数字开头`1`, 和

 T=1+t=v(mod9)。 

最后`T-v`是 9 的正倍数。我们可以得出`T`加上一次，删除其第一位数字，并准确获得`t`。 因此，两个操作可以改变任何`v`变成一个数，其模 9 的余数比旧余数小 1。 

这为我们提供了一种确定性的方法来调整模 9 余数，直到它匹配`b`。 一旦余数匹配并且当前值不超过`b`，单次加法达到`b`。 

有一个并发症。 如果`a`至少与`b`，临时余数调整过程可能会经过大于的值`b`，最后的加法可能会变成负数。 我们通过首先发送来完全避免这种情况`a`为零。 为此，请选择十进制重新单位

 RL​=11…1

 其长度`L`是一致的`a`以 9 为模，其值至少为`a`。 这样一个`L`总是存在且 L≤18。 由于 R L ​ ≡L(mod9)，差异`R_L-a`能被 9 整除。我们添加该差值，然后删除所有`L`领先者，达到零。 这正是官方社论中描述的两阶段建设。 

从零开始，我们可以安全地使用余数调整过程来达到`b`，然后将剩余的 9 的倍数相加。事件总数仍然很小。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | 在操作极限内呈指数增长，>10 17 可能的第一个加法 | 指数| 太慢了 |
 | 最佳| O(log 10 ​ 最大(a,b)) | 输出 | O(log 10 ​ max(a,b)) 已接受 |

 ## 算法演练

 1.如果`a == b`， 输出`Stable`以及零操作。 无需施工。 
2.如果`a < b`，保持当前值等于`a`并反复调整其模 9 的余数。为当前值`v`, 计算其位数`d`，然后设置`t = (v - 1) % 9`和`T = 10^d + t`。 
3. 添加`(T-v)/9`九。 结果正是`T`， 和`T`开始于`1`。 商为正，因为`T > v`，虽然它是积分，因为`T`和`v`模 9 具有相同的余数。 
4. 删除一位前导数字。 由于该数字是`1`，操作合法，寄存器变为`t`。 它的余数比前一个模 9 的余数小 1。 
5. 重复前两个步骤，直到当前值模 9 的余数与`b`。 最多需要九次这样的变换，因为每次变换都会将余数减一模 9。 
6. 添加`(b-v)/9`。 现在余数匹配，因此商是整数。 因为`a < b`，在余数调整阶段之后，当前值最多为 8，因此不大于`b`。 因此，除非这些值已经相等，否则最终的加法为正。 
7. 如果`a > b`,首先构造一个reunit`R`最多 18 位数字，使得`R >= a`和`R % 9 == a % 9`。 通过检查 1 到 18 的长度可以找到这样的长度。 
8. 添加`(R-a)/9`九，除非`R == a`，在这种情况下不需要添加。 寄存器现在正好是`R`。 
9. 全部删除`len(R)`前导数字。 每个数字都是`1`，因此删除有效并将寄存器更改为零。 
10. 从零开始，应用相同的余数调整程序`b`，然后从匹配的残数中执行最后的加法`b`。 

不变量很简单。 每个构造的加法都会将寄存器更改为 9 的倍数，因此它保留当前的余数。 每次删除都会删除一个前导`1`在我们的构造中，所以它将余数减一模 9。每次删除之前构造的数字总是`10^d+t`，这意味着它的第一个数字保证是`1`并且删除是合法的。 一旦余数等于`b % 9`，与当前值的差值`b`是9的倍数，所以最终相加达到`b`确切地。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

LIMIT = 10**18

def add_to_repunit(a, ops):
    """Transform a to zero using one repunit."""
    if a == 0:
        return 0

    # Find a repunit R >= a with R % 9 == a % 9.
    rep = 0
    chosen = None

    for length in range(1, 19):
        rep = rep * 10 + 1
        if rep >= a and rep % 9 == a % 9:
            chosen = rep
            chosen_len = length
            break

    # Such a repunit always exists for a <= 1e9.
    if chosen is None:
        raise RuntimeError("No suitable repunit")

    if chosen > a:
        x = (chosen - a) // 9
        ops.append(("+", x))

    ops.append(("-", chosen_len))
    return 0

def adjust_residue(cur, target_residue, ops):
    """
    Repeatedly decrease cur's residue modulo 9 until it equals
    target_residue. Each iteration uses +x, -1.
    """
    while cur % 9 != target_residue:
        d = len(str(cur))
        t = (cur - 1) % 9
        target = 10**d + t

        x = (target - cur) // 9
        if x <= 0:
            raise RuntimeError("Invalid positive addition")

        ops.append(("+", x))
        ops.append(("-", 1))

        cur = t

    return cur

def solve():
    a, b = map(int, input().split())

    if a == b:
        print("Stable")
        print(0)
        return

    ops = []

    if a >= b:
        # First reach zero.
        cur = add_to_repunit(a, ops)

        # Then construct b from zero.
        cur = adjust_residue(cur, b % 9, ops)

        if cur < b:
            x = (b - cur) // 9
            ops.append(("+", x))
            cur = b
    else:
        # a < b, so we can directly adjust the residue and then add.
        cur = adjust_residue(a, b % 9, ops)

        if cur < b:
            x = (b - cur) // 9
            ops.append(("+", x))
            cur = b

    assert cur == b
    assert len(ops) <= 1000

    print("Stable")
    print(len(ops))
    for typ, x in ops:
        print(typ, x)

if __name__ == "__main__":
    solve()
```这`add_to_repunit`函数实现了前半部分的构造`a >= b`。 它仅搜索 18 个可能的重新组合长度。 对于每个候选者，可被 9 整除的结果如下：`rep % 9 == a % 9`，所以所需的加法计数是一个整数。 

这`adjust_residue`函数实现按键二操作转换。 为了`cur`和`d`数字，`10**d + t`正好有`d+1`数字并以以下开头`1`。 在发出操作之前计算加法计数，这避免了对十进制进位行为的任何依赖。 

后`- 1`，新值正是`t`，因为删除第一个数字`10^d+t`留下十进制表示`t`，包括以下可能性：`t`为零。 

18 位重新单位安全地低于 10 18，并且从最多 10 位数字的输入生成的所有其他临时值最多为 10 10 +8。 Python 整数也具有任意精度，因此在构造过程中不会出现算术溢出。 

操作顺序很重要。 添加必须在删除之前，因为只有当前导数字为 时删除才合法。`1`。 只有在模 9 的余数一致后才执行最终的加法，以保证其参数是整数。 

## 工作示例

 ### 示例 1

 用于输入`0 0`，值已经一致。 

| 当前| 目标| 行动| 新潮流|
 | ---| ---| ---| ---|
 | 0 | 0 | 无 | 0 |

 该算法立即打印零操作。 这是尽可能最小的结构并且避免产生不必要的正向操作。 

### 示例 2

 用于输入`1 9`，我们有`1 < 9`，目标余数为`0`。 

| 当前|`current % 9`|`t = (current-1) % 9`| 建构价值 | 行动| 新潮流|
 | ---| ---| ---| ---| ---| ---|
 | 1 | 1 | 0 | 10 | 10`+ 1`,`- 1`| 0 |
 | 0 | 0 | 0 | 0 |`+ 1`| 9 |

 第一对将余数从 1 更改为 0。最后的加法将 0 更改为 9。该示例使用更短的结构，`+ 2`,`- 1`，但问题接受任何有效的序列。 

该跟踪说明了为什么没有必要最小化操作数量。 该构造可能会使用一些额外的事件，但远低于 1000 个的限制。 

### 边界示例

 考虑`0 1`。 

| 当前|`current % 9`|`t`| 建构价值 | 新潮流|
 | ---| ---| ---| ---| ---|
 | 0 | 0 | 8 | 18 | 18 8 |
 | 8 | 8 | 7 | 17 | 17 7 |
 | 7 | 7 | 6 | 16 | 16 6 |
 | 6 | 6 | 5 | 15 | 15 5 |
 | 5 | 5 | 4 | 14 | 14 4 |
 | 4 | 4 | 3 | 13 | 3 |
 | 3 | 3 | 2 | 12 | 12 2 |
 | 2 | 2 | 1 | 11 | 11 1 |

 所需的余数为 1，因此该过程在 1 处停止。不需要最终添加。 

此示例练习了目标非常小的情况，即使该构造暂时创建了两位数。 最大的临时值只有18。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(logmax(a,b)) | 最多 18 次重新单元检查和最多 9 次残差调整轮次，每次使用常量大小的整数 |
 | 空间| O(logmax(a,b)) | 操作列表仅包含相对于十进制位数的恒定数量的操作 |

 此实现中实际操作数最多为 21 次。 初始重新单位转换最多使用 2 个事件，剩余调整最多使用 18 个事件，然后是最后一次添加。 因此，1000 次操作所需的限制非常宽松。 所有临时值都低于 10 18，因此该构造也满足寄存器界限。 

## 测试用例

 由于输出不是唯一的，因此测试应该验证生成的操作序列，而不是将其与一个固定输出进行比较。```python
import sys
import io

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    solve()

    out = sys.stdout.getvalue()

    sys.stdin = old_stdin
    sys.stdout = old_stdout
    return out

def verify(inp: str, out: str) -> bool:
    a, b = map(int, inp.split())
    lines = out.strip().splitlines()

    assert lines[0] == "Stable"
    n = int(lines[1])
    assert 0 <= n <= 1000
    assert len(lines) == n + 2

    cur = a

    for line in lines[2:]:
        parts = line.split()
        assert len(parts) == 2

        typ, x = parts
        x = int(x)
        assert x > 0

        if typ == "+":
            cur += 9 * x
            assert cur <= 10**18

        elif typ == "-":
            s = str(cur)
            y = x

            assert 1 <= y <= len(s)
            assert all(ch == "1" for ch in s[:y])

            s = s[y:]
            cur = int(s) if s else 0
            assert cur <= 10**18

        else:
            assert False, "unknown operation"

    assert cur == b
    return True

# Provided sample 1 has an exact canonical output.
assert run("0 0") == "Stable\n0\n", "sample 1"

# Provided sample 2 has many valid outputs, so verify its semantics.
assert verify("1 9", run("1 9")), "sample 2"

# Minimum-size input.
assert verify("0 0", run("0 0")), "minimum values"

# All-equal nonzero values.
assert verify("123456789 123456789", run("123456789 123456789")), "equal values"

# Maximum input values.
assert verify("1000000000 1000000000", run("1000000000 1000000000")), "maximum equal values"

# Large value going down to zero, exercising the repunit construction.
assert verify("1000000000 0", run("1000000000 0")), "repunit boundary"

# Different residues with a very small target.
assert verify("0 1", run("0 1")), "small target"

# Adjacent boundary near 1e9.
assert verify("999999999 1000000000", run("999999999 1000000000")), "large adjacent values"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`0 0`|`Stable`, 零操作| 立即相等和最小值 |
 |`1 9`| 任何有效的`Stable`建筑| 提供样品和残留变化|
 |`123456789 123456789`|`Stable`, 零操作| 相等的非零值 |
 |`1000000000 1000000000`|`Stable`, 零操作| 最大输入边界|
 |`1000000000 0`| 任何有效的`Stable`建筑| 重报众多前导的转换和删除 |
 |`0 1`| 任何有效的`Stable`建筑| 具有不同模 9 残数的小目标 |
 |`999999999 1000000000`| 任何有效的`Stable`建筑| 相邻值大和重复残差调整|

 ## 边缘情况

 对于`0 0`，相等性检查在任何算术构造之前终止。 寄存器保持为零，因此确切的输出是`Stable`其次是`0`。 

为了`1 9`，直接相加是不可能的，因为差值是 8，而不是 9 的倍数。该算法首先通过构造 10 并删除其前导，将余数从 1 更改为 0`1`，获得零。 然后加上 9 的倍数，得到 9。临时值 10 有效。 

为了`0 1`，算法从余数 0 开始，而目标余数 1。每个`+x, -1`对将余数减一模 9。删除后的值序列为`8, 7, 6, 5, 4, 3, 2, 1`，因此八轮后达到目标残差。 每一个加法都会构建`18`,`17`, ...,`11`，分别，然后删除前导`1`。 

为了`1000000000 0`，算法选择10位重复单位`1111111111`。 它有相同的余数`1000000000`，而且它更大，所以差可以被 9 整除。加上这个差达到重单位，然后删除所有 10 个`1`数字产生零。 最大的临时值仅为`1111111111`。 

为了`999999999 1000000000`，初始值余数为 0，而目标值余数为 1。余数调整过程首先产生 8，然后产生 7，一直持续到 1。从那里开始，差值为`1000000000`能被 9 整除，因此最后的加法恰好达到了目标。 这表明中间寄存器值不需要保持在最终目标以下，只需低于所需的 10 18 界限即可。
