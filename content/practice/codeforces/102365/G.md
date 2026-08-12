---
title: "CF 102365G - 无限加一"
description: "计数程序描述了我们在一个固定的有序宇宙中移动了多远。 空程序不改变任何内容，+取下一个未使用的元素，串联依次运行两个程序，[P]重复P无限次。"
date: "2026-08-12T23:58:22+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102365
codeforces_index: "G"
codeforces_contest_name: "UBC Programming Contest 2019 (UBCPC 2019)"
rating: 0
weight: 102365
solve_time_s: 125
verified: true
draft: false
---

[CF 102365G - 无限加一](https://codeforces.com/problemset/problem/102365/G)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 5s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 计数程序描述了我们在一个固定的有序宇宙中移动了多远。 空程序没有改变任何东西，`+`获取下一个未使用的元素，串联依次运行两个程序，并且`[P]`重复`P`无限多次。 从空集开始，每个程序都会生成宇宙的初始部分，因此比较两个程序相当于比较它们未使用的第一个元素的位置。 

考虑这些初始片段的有用方法是将其视为序数。 有限序列`+`运算产生一个普通的自然数。 重复`+`无限给出第一个无限序数，通常写为 (\omega)。 重复表示 (\alpha) 的程序会无限产生 (\alpha\cdot\omega)，而依次运行一个程序则相当于序数加法。 

例如，`[+]`代表 (\omega),`[+]+`表示 (\omega+1)，并且`[+][+]`表示 (\omega\cdot2)。 表达式`+++[+++]`表示 (3+\omega=\omega)，因为在极限序数之前添加有限数不会改变结果。 这正是普通整数直觉在这里很危险的原因。 

输入最多包含 100 个程序，每个程序的长度最多为 100。这足够小，可以递归地解析每个表达式，并对大小与表达式成正比的表示执行符号操作。 困难不在于输入大小，而在于某些程序描述了真正无限的对象，因此显式执行它们永远不可能是正确的通用解决方案。 

输出是按它们所代表的序数排序的原始程序字符串。 代表相同序数的程序可以以任何相对顺序出现。 

第一个边缘情况是空循环。 例如：```
2
[]
+
```正确的输出是：```
[]
+
```

`[]`永远重复空程序，但空程序永远不会添加任何内容，因此它代表零。 将每个括号对视为推进计数的东西会错误地将其放在后面`+`。 

另一个边缘情况是无限循环之前的有限工作：```
2
+++
+++[+++]
```正确的输出是：```
+++
+++[+++]
```第一个程序代表(3)，第二个程序代表(3+\omega=\omega)。 一个简单的实现，只计算可见的`+`字符可能会错误地将第二个表达式视为大了三个有限步，而忽略了循环达到极限序数的事实。 

一个特别微妙的情况是：```
3
[+]
+[+]
+[+]+
```这些值分别为 (\omega,\omega,\omega+1)，因此前两个相等并且可以按任意顺序出现，后面是`+[+]+`。 原因`+[+]`不是 (\omega+1) 是`[+]`在初始之后永远运行`+`，并且无限序列填充该初始元素之后的所有元素。 

## 方法

 最直接的方法是模拟程序生成的集合。 对于有限序列`+`操作这很容易，但是`[P]`需要无限多次重复。 人们可以在一定次数 (K) 的重复之后截断每个循环，并比较所得的有限前缀，但没有有限 (K) 可以使这一点精确。 节目`[+]`和`[+]+`仅在所有自然数都已生成后才不同。 任何仅执行有限多个操作的模拟都将两者视为相同的有限前缀。 

嵌套循环使显式扩展变得更糟。 如果深度 (d) 表达式在每个循环级别展开 (K) 次重复，则展开可能需要 (\Theta(K^d)) 次执行。 对于长度为 100 的字符串，嵌套深度可以接近 50，因此即使 (K=100) 也会给出大约 (100^{50}=10^{100}) 扩展操作的正式最坏情况。 更根本的是，没有固定的有限（K）给出正确的算法，因为极限行为本身必须用符号表示。 

关键的观察是每个生成集都是良序的初始段，因此它有一个序数作为其顺序类型。 可用的运算包括序数后继、序数加法和 (\omega) 乘法。 由这些运算产生的所有序数都可以以康托范式存储。 

每个相关序数都有唯一的表示

 [
 \omega^{\beta_1}c_1+\omega^{\beta_2}c_2+\cdots+\omega^{\beta_k}c_k,
 ]

 其中指数严格递减并且每个系数都是正有限整数。 指数本身就是序数，可以用同样的方式递归表示。 

这给出了非常小的象征性物体。 一个`+`运算将有限项加一。 连接两个程序执行序数加法。 如果非零序数具有前导项 (\omega^\beta c)，则将其乘以 (\omega) 将丢弃除前导指数之外的所有内容并生成 (\omega^{\beta+1})。 因此`[P]`甚至无需执行一次无限迭代即可进行评估。 

暴力破解的想法之所以有效，是因为执行程序确实会构造其序数前缀。 它失败了，因为有限模拟无法达到极限序数。 观察到这些程序具有精确的序数算术代数，让我们可以用康托范式的有限操作来代替无限执行。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | 无界且没有精确的有限截止值 | 无界| 太慢而且通常不正确 |
 | 最佳 | (O(M\log M\cdot L^2)) | (O(ML)) | 已接受 |

 这里（L\le100）是最大程序长度，（M\le100）。 

## 算法演练

 1. 用康托范式将序数表示为项元组。 每个术语都是`(exponent, coefficient)`， 在哪里`exponent`是另一种序数表示。 空元组代表零。 例如，(7) 表示为一项具有指数 0 和系数 7，而 (Ω+3) 有两项，一项具有指数 1，一项具有指数 0。 
2. 将每个程序解析为表达式序列，直到匹配`]`或字符串的末尾。 一个`+`贡献序数，而括号内的表达式则递归求值，然后乘以 (\omega)。 
3. 在解析序列时实现序数加法。 如果右操作数为零，则不会发生任何变化。 否则，设其首指数为 (\beta)。 在左操作数中，指数小于 (β) 的每一项都被丢弃，因为当附加较大次数的序数时，较低次数的项会被吞掉。 如果左操作数有一个指数项恰好为 (β)，则其系数将增加右操作数的系数。 然后附加右操作数的其余项。 
4. 单独实现后继者`+`。 如果序数是有限的，则增加其系数。 如果它没有有限的最后一项，则附加一个系数为 1 的新 (\omega^0) 项。 这种区别很重要，因为`+`是一个后续操作，而`[+]`是产生 (\omega) 的极限运算。 
5. 对于`[P]`，首先评估`P`。 如果它代表零，结果仍然是零。 否则，令其首项为 (\omega^\beta c)。 无限次重复整个序数 (\alpha) 给出 (\alpha\cdot\omega=\omega^{\beta+1})。 系数和每一个较低的项都消失了，因此生成的 CNF 恰好由一项、指数 (β+1) 和系数 1 组成。 
6. 使用 CNF 元组的自然字典顺序比较。 首先比较领先指数。 如果它们不同，则领先指数较大的序数较大。 如果相等，则比较它们的系数。 如果它们也相等，则继续下一项。 正确的前缀小于较长的元组。 由于指数由相同的递归结构表示，因此 Python 的元组比较正是以递归方式执行此比较。 
7. 将每个原始程序及其规范序数表示形式存储在一起，然后按表示形式排序并打印原始字符串。 等量表示对应于等量计数程序，因此它们的顺序不受限制。 

### 为什么它有效

 不变的是，在解析任何程序片段之后，其存储的元组正是该片段所表示的序数的康托范式。 

一个`+`运算保留了不变量，因为它恰好是序数后继。 序列连接保留了它，因为实现的操作是康托范式中序数加法的定义。 对于括号表达式，主体代表某个序数 (\alpha)。 无限重复表示 (\alpha\cdot\omega)，对于每个非零 (\alpha)，该乘积恰好是 (\omega^{\beta+1})，其中 (\beta) 是 (\alpha) 的首指数。 因此，每个递归解析步骤都会产生正确的序数。 

最后，康托范式是唯一的，其字典顺序是序数顺序。 对这些规范表示进行排序会根据所需的关系对程序进行排序。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

ZERO = ()
ONE = ((ZERO, 1),)

def succ(a):
    """Return a + 1."""
    if not a:
        return ONE

    terms = list(a)

    # If the last term is omega^0 * c, increase c.
    if terms[-1][0] == ZERO:
        exp, coeff = terms[-1]
        terms[-1] = (exp, coeff + 1)
    else:
        # Append omega^0.
        terms.append((ZERO, 1))

    return tuple(terms)

def add(a, b):
    """Return the ordinal sum a + b in CNF."""
    if not a:
        return b
    if not b:
        return a

    beta = b[0][0]

    # Keep terms of a whose exponent is strictly greater
    # than beta. If beta occurs, keep that term too.
    i = 0
    while i < len(a) and a[i][0] > beta:
        i += 1

    result = list(a[:i])

    if i < len(a) and a[i][0] == beta:
        result.append((beta, a[i][1] + b[0][1]))
        i += 1
    else:
        result.append(b[0])

    result.extend(b[1:])
    return tuple(result)

def loop(a):
    """Return a * omega."""
    if not a:
        return ZERO

    # If a starts with omega^beta * c, then
    # a * omega = omega^(beta + 1).
    beta = a[0][0]
    return ((succ(beta), 1),)

def parse_program(s):
    n = len(s)

    def parse(pos, closing):
        cur = ZERO

        while pos < n and (not closing or s[pos] != ']'):
            if s[pos] == '+':
                cur = succ(cur)
                pos += 1

            elif s[pos] == '[':
                inside, pos = parse(pos + 1, True)
                cur = add(cur, loop(inside))

            else:
                # The caller consumes matching ']'.
                break

        if closing and pos < n and s[pos] == ']':
            pos += 1

        return cur, pos

    value, _ = parse(0, False)
    return value

def solve():
    m = int(input())
    programs = [input().strip() for _ in range(m)]

    values = [(parse_program(p), p) for p in programs]
    values.sort(key=lambda x: x[0])

    sys.stdout.write("\n".join(p for _, p in values))

if __name__ == "__main__":
    solve()
```该表示使用不可变元组，以便序数可以安全地包含其他序数作为其指数。 这也免费为Python提供了一个有用的属性：元组相等和字典比较递归地比较完整的CNF结构。`succ`仔细处理有限尾部。 如果最后一个指数为零，则序数已经具有有限分量，并且其系数增加。 否则序数没有有限尾部，因此后继者创建一个新的 (\omega^0) 项。`add`遵循序数加法的 CNF 规则。 假设右操作数的第一项是 (\omega^\beta c)。 左边指数低于 (\beta) 的每一项都消失。 指数等于 (β) 的项保留下来，并且其系数与右操作数的系数相结合。 右操作数的其余部分被原封不动地复制。 

比较`a[i][0] > beta`是有效的，因为指数本身就是规范的序数元组。 Python 根据完全相同的顺序递归地比较这些元组。 不需要转换为巨大的整数，并且不存在整数溢出的可能性。`loop`是关键的无限运算。 如果`a`是非零并且以 (\omega^\beta c) 开头，那么

 [
 a\cdot\omega=\omega^{\beta+1}。 
]

 整个低阶部分在极限中消失。 例如，((\omega+1)\omega=\omega^2)，而(7\omega=\omega)。 

解析器递归地使用完整的括号表达式。 空括号自然会产生零，因为递归序列不包含任何操作。 解析完尸体后，`loop`应用周围括号的语义，并将生成的序数添加到之前解析的所有内容中。 

## 工作示例

 有一个官方示例，因此下面的第二条跟踪使用较小的自定义输入，旨在公开限制行为。 

### 示例 1

 相关规范值如下所示。 

| 节目| 解析值 | CNF解读 |
 | ---| ---| ---|
 |`[][[][]][]`| (0) | 空 |
 |`+`| (1) | (1) |
 |`+++++++`| (7) | (7) |
 |`+++[+++]`| (\omega) | (3+\omega) |
 |`[+]+`| (\omega+1) | (\omega+1) |
 |`[+][+]`| (\omega\cdot2) | (\omega+\omega) |
 |`+[+[+]+]+`| (\omega^2+1) | (1+(\omega+1)\omega+1) |
 |`[+][[+]][+]`| (\omega^2+\omega) | (\omega+\omega^2+\omega) |

 解析器达到`+++[+++]`首先构建 (3)，然后评估`+++`括号内为(3)，将括号内部分变为(3\omega=\omega)。 将前三个相加得到 (3+\omega=\omega)。 

为了`+[+[+]+]+`，内部`+[+]+`表示(\omega+1)。 它的循环是((\omega+1)\omega=\omega^2)，周围的后继给出(\omega^2+1)。 表达式`[+][[+]][+]`相反以`[+]`，它附加 (\omega) 的完整副本，给出 (\omega^2+\omega)。 这区分了看似相似的两个表达式。 

### 自定义限制示例

 考虑：```
5
+
[+]
+[+]
+[+]+
[+][+]
```解析轨迹为：

 | 节目| 正在应用的操作 | 当前序号 |
 | ---| ---| ---|
 |`+`| (0) | 的后继者 (1) |
 |`[+]`| (1) | 的循环 (\omega) |
 |`+[+]`| 后继者，然后循环 | (1\cdot\omega=\omega) |
 |`+[+]+`| 后继者、循环、后继者 | (\omega+1) |
 |`[+][+]`| (1) 循环，然后加上 (\omega) | (\omega\cdot2) |

 因此，排序后的输出为：```
+
[+]
+[+]
+[+]+
[+][+]
```相等的值`[+]`和`+[+]`练习区分后继和无限重复。 后者首先创建一个元素，但随后的无限循环填充所有剩余的有限位置，因此当将其视为与 (\omega) 的序数和时，初始有限前缀消失。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O(M\log M\cdot L^2)) | 解析一个程序最多执行 (O(L)) 序数加法，每次最多复制 (O(L)) CNF 项，排序执行 (O(M\log M)) 比较 |
 | 空间| (O(ML)) | 每个程序的规范表示都具有 (O(L)) 存储项和嵌套指数数据 |

 对于 (M\le100) 和 (L\le100)，输入最多包含 10,000 个字符。 与任何实现无限集合的尝试相比，符号表示仍然很小。 该算法仅执行递归解析、短元组操作和排序，因此它可以轻松满足一秒限制和 1024 MB 内存限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

ZERO = ()
ONE = ((ZERO, 1),)

def succ(a):
    if not a:
        return ONE

    terms = list(a)
    if terms[-1][0] == ZERO:
        exp, coeff = terms[-1]
        terms[-1] = (exp, coeff + 1)
    else:
        terms.append((ZERO, 1))
    return tuple(terms)

def add(a, b):
    if not a:
        return b
    if not b:
        return a

    beta = b[0][0]
    i = 0

    while i < len(a) and a[i][0] > beta:
        i += 1

    result = list(a[:i])

    if i < len(a) and a[i][0] == beta:
        result.append((beta, a[i][1] + b[0][1]))
        i += 1
    else:
        result.append(b[0])

    result.extend(b[1:])
    return tuple(result)

def loop(a):
    if not a:
        return ZERO

    beta = a[0][0]
    return ((succ(beta), 1),)

def parse_program(s):
    n = len(s)

    def parse(pos, closing):
        cur = ZERO

        while pos < n and (not closing or s[pos] != ']'):
            if s[pos] == '+':
                cur = succ(cur)
                pos += 1
            elif s[pos] == '[':
                inside, pos = parse(pos + 1, True)
                cur = add(cur, loop(inside))
            else:
                break

        if closing and pos < n and s[pos] == ']':
            pos += 1

        return cur, pos

    return parse(0, False)[0]

def solve_io(inp):
    data = inp.splitlines()
    m = int(data[0])
    programs = data[1:1 + m]

    values = [(parse_program(p), p) for p in programs]
    values.sort(key=lambda x: x[0])

    return "\n".join(p for _, p in values) + "\n"

# Provided sample
sample1_in = """8
+
[+]+
[+][+]
+++++++
+++[+++]
+[+[+]+]+
[+][[+]][+]
[][[][]][]
"""

sample1_out = """[][[][]][]
+
+++++++
+++[+++]
[+]+
[+][+]
+[+[+]+]+
[+][[+]][+]
"""

assert solve_io(sample1_in) == sample1_out, "sample 1"

# Minimum-size program and zero-producing loops
assert solve_io("""3
[]
+
++
""") == """[]
+
++
""", "minimum-size programs"

# All values equal
assert solve_io("""5
[]
[][]
[][[]]
[][[][]][]
[][][][]
""") == """[]
[][]
[][[]]
[][[][]][]
[][][][]
""", "all equal"

# Boundary between finite values and omega
assert solve_io("""5
+++
+++[+++]
[+]
+[+]
+[+]+
""") == """+++
+++[+++]
[+]
+[+]
+[+]+
""", "finite versus limit ordinal"

# Maximum-size programs, all equal
long_program = "+" * 100
maximum_input = "100\n" + "\n".join([long_program] * 100) + "\n"
maximum_output = "\n".join([long_program] * 100) + "\n"

assert solve_io(maximum_input) == maximum_output, "maximum-size input"

# A useful equality: 1 + omega = omega
assert solve_io("""4
+[+]
[+]
+[+]+
++[+]
""") == """[+]
+[+]
++[+]
+[+]+
""", "ordinal addition and successor"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`[]`,`+`,`++`|`[]`,`+`,`++`| 最小大小的程序和空循环为零的事实 |
 | 几个零产生表达式 | 输入订单| 允许以任何顺序使用相同的序数表示 |
 |`+++`,`+++[+++]`,`[+]`,`+[+]`,`+[+]+`|`+++`,`+++[+++]`,`[+]`,`+[+]`,`+[+]+`| 有限序数 (\omega) 和 (\omega+1) | 之间的边界
 | 100 个长度为 100 | 的程序 同样的 100 个程序 | 最大输入大小以及不存在递归或整数大小问题 |
 |`[+]`,`+[+]`,`++[+]`,`+[+]+`|`[+]`,`+[+]`,`++[+]`,`+[+]+`| 序数加法可以删除有限的前缀，而最终的后继仍然会改变值 |

 ## 边缘情况

 空程序由空 CNF 元组表示。 因此`[]`将其空体评估为零，`loop(0)`返回零，并将其与另一个表达式连接没有任何效果。 为了`[][[][]][]`，每个括号内的主体都是空的或仅由空程序组成，因此最终值保持为零。 这可以处理任意嵌套的空括号，除了普通递归返回之外没有任何特殊的解析器情况。 

对于后跟无限循环的有限前缀，当循环产生极限序数时，不得将有限前缀视为普通的加性偏移量。 在`+++[+++]`，第一部分给出 (3)，而括号内的部分给出 (3\cdot\omega=\omega)。 加法例程接收 (3+\omega)，发现右操作数具有前导指数 (1)，并删除左操作数的指数零项。 结果正好是(\omega)。 

表达式`+[+]`以更小的形式执行相同的规则。 第一个`+`给出 (1)，并且`[+]`表示 (\omega)。 加法 (1+\omega) 变为 (\omega)，因为左侧的零指数项被丢弃。 基于普通整数算术的解析器会错误地保留前导整数。 

之间的区别`[+]`和`[+]+`测试相反的边界。`[+]`产生 (\omega)，而最终的`+`在`[+]+`是一个实际的后继者，所以结果是(\omega+1)。 在表述中，`[+]`是`((1, 1),)`，而其后继者附加零指数项，产生`((1, 1), (0, 1))`。 

嵌套循环测试前导指数是否正确更新。 为了`[[+]]`，内部`[+]`表示 (\omega)。 因此，外循环计算 (\omega\cdot\omega=\omega^2)。 在 CNF 中，(\omega) 的首指数为 (1)，因此`loop`适用`succ`到该指数并产生单项 (\omega^2)。 重复这种构造自然会支持更深层次的表达，例如`[[[+]]]`，代表(\omega^3)。 

最后，不得强迫平等的程序遵循特定的文本顺序。 表达式如`[+]`和`+[+]`两者都表示 (\omega)，尽管它们的语法不同。 排序键是规范的序数表示形式，因此相等的值比较相等。 Python 的稳定排序保留了它们的输入顺序，这是问题所允许的。
