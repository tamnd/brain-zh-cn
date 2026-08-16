---
title: "CF 102348G - 交换字母"
description: "我们有两个长度相同的字符串 s 和 t。 每个位置包含 a 或 b。 一个操作选择 s 中的任意位置和 t 中的任意位置，然后交换这两个字符。"
date: "2026-08-15T17:31:33+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102348
codeforces_index: "G"
codeforces_contest_name: "ICPC 2019-2020 NERC (NEERC), Southern and Volga Russia Qualifier"
rating: 0
weight: 102348
solve_time_s: 224
verified: false
draft: false
---

[CF 102348G - 交换字母](https://codeforces.com/problemset/problem/102348/G)

 **评级：** -
 **标签：** -
 **求解时间：** 3m 44s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有两个字符串`s`和`t`相同长度的。 每个位置包含任一`a`或者`b`。 一次操作选择其中的任意位置`s`以及任何位置`t`，然后交换两个字符。 目标是使用尽可能少的操作使两个整个字符串相同，同时还打印一个最佳的交换序列。 

查看某个位置的有用方法是比较占据该位置的两个字符。 如果他们已经同意，则无需关注该立场。 如果他们不同意，则该职位是以下类型之一`ab`， 意义`s[i] = a`和`t[i] = b`，或输入`ba`， 意义`s[i] = b`和`t[i] = a`。 

长度可以达到`2 * 10^5`，因此具有二次工作的算法可以执行`4 * 10^10`最坏情况下的迭代次数，远远超出了 2 秒竞赛限制所允许的范围。 我们需要一个解决方案，其工作本质上是线性的`n`，每个头寸只需少量记账。 由于字母表仅包含两个字符，因此不匹配类型为我们提供了实现这一目标所需的结构。 

有几种边缘情况可能会导致看似合理的实施失败。 首先，奇数个不匹配是不可能的。 例如，```
1
a
b
```有一个`ab`不匹配。 只有一个`a`在两个字符中，每个最终相等的对包含零个或两个`a`人物。 任何交换顺序都不能改变总数量`a`字符，所以正确的输出是`-1`。 粗心的实现只是简单地配对不匹配而不检查奇偶校验可能会导致一个位置无法解决。 

当两种不匹配类型都具有奇数计数时，会出现第二种边缘情况。 例如，```
2
ab
ba
```有一个`ab`位置和一`ba`位置。 直接的一次性配对无法修复它们，因为它们的方向相反。 不过，两次交换就足够了。 交换`s[1]`和`t[1]`，将第一个不匹配从`ab`进入`ba`，然后交换`s[1]`和`t[2]`。 两个位置变得平等。 仅配对相等的不匹配类型的解决方案会错误地得出这种情况不可能的结论。 

第三种边缘情况是根本没有不匹配的情况：```
3
aba
aba
```正确答案是`0`，没有操作线。 假设至少存在一个不匹配的实现可能会意外访问空列表或打印不必要的操作。 

## 方法

 一种直接的方法是反复查找不匹配并寻找可以修复它的另一个位置。 例如，找到一个`ab`位置，我们可以扫描剩余位置寻找另一个`ab`位置并使用一个跨字符串交换来解决这两个问题。 如果不存在这样的位置，我们可以处理涉及到的特殊情况`ba`位置有两次互换。 

这种策略在逻辑上是合理的，因为每次搜索都在寻找有效的合作伙伴，并且每次成功的操作都会减少不匹配的数量。 问题是重复扫描。 在最坏的情况下，可能会出现`Θ(n)`不匹配，找到每个伙伴可以检查`Θ(n)`职位。 字符比较总数可达`Θ(n²)`，这大约是`4 * 10^10`为了`n = 2 * 10^5`。 这对于时间限制来说太过分了。 

关键的观察是我们不需要动态地寻找合作伙伴。 与错误位置相关的唯一信息是它是否是`ab`或者`ba`。 我们可以一次性收集每种类型的所有位置。 

二`ab`位置始终可以通过一项操作来固定。 假设职位`x`和`y`都是`ab`。 交换`s[x]`和`t[y]`交流`a`和`b`。 在`x`,`s[x]`变化自`a`到`b`, 匹配`t[x]`。 在`y`,`t[y]`变化自`b`到`a`, 匹配`s[y]`。 同样的论点适用于两个人`ba`职位。 

这会立即处理每对相等的不匹配类型。 唯一剩下的情况是两个不匹配列表都包含一个未配对的位置。 由于不匹配的总数必须是偶数，因此这两个列表要么都具有偶数大小，要么都具有奇数大小。 在奇怪的情况下，让`x`是剩下的`ab`位置和`y`其余`ba`位置。 第一次交换`s[x]`和`t[x]`。 这改变了位置`x`从`ab`进入`ba`。 现在两者`x`和`y`是`ba`，所以第二次交换`s[x]`和`t[y]`修复两者。 

操作次数的下限也很简单。 一次操作最多可以修复两个当前不匹配的位置，因此将两个相等的不匹配配对至少需要一次操作，并且是最优的。 当一`ab`和一个`ba`仍然存在，一种操作无法解决两者，因为它们的方向相反。 因此，上述两操作结构是最佳的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 反复寻找合作伙伴|`O(n²)`|`O(n)`| 太慢了 |
 | 存储不匹配的位置并将它们配对 |`O(n)`|`O(n)`| 已接受 |

 ## 算法演练

 1. 从左到右扫描每个位置。 如果`s[i] == t[i]`，忽略它。 如果`s[i] == 'a'`和`t[i] == 'b'`, 追加`i`到`ab`列表。 否则追加`i`到`ba`列表。 这根据仅有的两个可能的不匹配方向来分离每个有问题的位置。 
2. 检查两个列表的奇偶性。 总数`a`每次交换都会保留两个字符串中的字符，并且最终的相等对包含零个或两个`a`人物。 因此总数为`a`字符必须是偶数。 同样，不匹配的总数必须是偶数。 由于只要两个不匹配计数的总和为偶数，它们就具有相同的奇偶性，因此在以下情况下就足以拒绝`len(ab) + len(ba)`很奇怪。 
3. 将连续位置配对`ab`。 对于每对`ab[2j]`和`ab[2j + 1]`，输出之间的交换`s[ab[2j]]`和`t[ab[2j + 1]]`。 一次操作可以固定两个位置，因此这对于该对来说是最佳的。 
4. 将连续位置配对`ba`以完全相同的方式。 对于职位`x = ba[2j]`和`y = ba[2j + 1]`， 交换`s[x]`和`t[y]`。 手术后，两个不匹配位置均相等。 
5. 如果两个不匹配列表的长度均为奇数，则每个列表中保留一个位置。 令这些位置为`x = ab[-1]`和`y = ba[-1]`。 第一个输出`(x, x)`，交换位置处的两个字符`x`并将其类型从`ab`到`ba`。 然后输出`(x, y)`。 剩下的两个`ba`不匹配现在配对并变得相等。 
6. 打印时将每个存储的从零开始的索引转换为从一开始的索引。 输出计数就是生成的操作列表的长度。 

### 为什么它有效

 初始扫描后，每个不匹配都恰好属于两个列表之一。 相同不匹配类型的两个位置之间的交换可以修复这两个位置，而不会影响任何已经固定的位置。 因此，可以成对地最佳地删除两个列表的所有偶数大小的部分。 

如果两个列表都是奇数，则每个列表中仅保留一个位置。 第一个额外的交换改变了剩余的`ab`不匹配成`ba`不匹配，之后剩下的两个不匹配具有相同的类型，并且可以通过再一次交换来修复。 如果总不匹配计数为奇数，则不存在解决方案，因为每个操作都保留两个字符串变得相同所需的奇偶校验条件。 

对两个相等的不匹配类型使用的每个操作都会修复两个不匹配，这是最大可能的。 唯一不可避免的例外是最后的相反对，其中需要两次操作。 因此构造的序列具有最小可能的长度。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input())
    s = input().strip()
    t = input().strip()

    ab = []
    ba = []

    for i in range(n):
        if s[i] == t[i]:
            continue
        if s[i] == 'a':
            ab.append(i)
        else:
            ba.append(i)

    if (len(ab) + len(ba)) % 2:
        print(-1)
        return

    operations = []

    for i in range(0, len(ab) - 1, 2):
        operations.append((ab[i] + 1, ab[i + 1] + 1))

    for i in range(0, len(ba) - 1, 2):
        operations.append((ba[i] + 1, ba[i + 1] + 1))

    if len(ab) % 2 == 1:
        x = ab[-1] + 1
        y = ba[-1] + 1
        operations.append((x, x))
        operations.append((x, y))

    out = [str(len(operations))]
    out.extend(f"{x} {y}" for x, y in operations)
    print("\n".join(out))

if __name__ == "__main__":
    solve()
```第一个循环仅记录不匹配，因此相等的位置永远不会进入后面的逻辑。 这很有用，因为随后生成的每个操作都可以完全根据不匹配列表进行推理。 

奇偶校验在构造操作之前执行。 由于每次操作仅交换现有字符，因此无法更改总字符数`a`两个字符串中的字符。 具有相同字符串的最终状态必然具有偶数个`a`字符，因此奇怪的不匹配计数证明不可能。 

两个配对循环使用`range(0, len(list) - 1, 2)`。 当列表长度为奇数时，上限故意停止在最终元素之前。 最后一个元素是为特殊的两次操作结构保留的。 

特殊情况在第一个操作中两次使用相同的索引，例如`(x, x)`。 这是合法的，因为第一个索引属于`s`第二个属于`t`，所以操作交换`s[x]`和`t[x]`。 这不是一个禁止操作。 对于一个`ab`不匹配，它将位置更改为`ba`。 

所有内部索引都是从零开始的，因为 Python 字符串使用从零开始的索引。 仅当存储在输出中时，它们才会加一，以匹配问题所需的基于 1 的位置。 

没有突变`s`或者`t`是必要的。 这些操作源自原始的不匹配分类，并且每个生成的操作在数学上已知以固定其预期位置。 这也避免了后续分类决策的意外更改。 

## 工作示例

 ### 示例 1

 输入是：```
4
abab
aabb
```失配分类为：

 | 索引 |`s[i]`|`t[i]`| 类型 |`ab`列表 |`ba`列表 |
 | ---| ---| ---| ---| ---| ---|
 | 0 | 一个 | 一个 | 等于| []| []|
 | 1 | 乙| 一个 |`ba`| []| [1] |
 | 2 | 一个 | 乙|`ab`| [2] | [1] |
 | 3 | 乙| 乙| 等于| [2] | [1] |

 有一个`ab`和一个`ba`，所以两个列表都是奇数。 该算法使用特殊情况：

 | 步骤| 操作，零基础| 目的|
 | ---| ---| ---|
 | 1 |`(2, 2)`| 将位置 2 更改为`ab`到`ba`|
 | 2 |`(2, 1)`| 将两者配对`ba`不匹配 |

 转换为基于一的索引，输出为：```
2
3 3
3 2
```第一个操作将字符串更改为`abab`和`aabb`到`abbb`和`aaab`。 第二个操作使两个字符串`abab`。 这两个操作是必要的，因为原始错配具有相反的方向。 

### 示例 2

 输入是：```
1
a
b
```踪迹是：

 | 索引 |`s[i]`|`t[i]`| 类型 |`ab`|`ba`| 总不匹配|
 | ---| ---| ---| ---| ---| ---| ---|
 | 0 | 一个 | 乙|`ab`| [0]| []| 1 |

 不匹配计数是奇数，因此算法立即打印：```
-1
```不可能存在有效的序列，因为仅有的两个字符恰好包含一个`a`，而两个相等的字符串将包含偶数个`a`两个字符串中的字符。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |`O(n)`| 每个位置被扫描一次，并且每个不匹配在生成操作时被处理一次。 |
 | 空间|`O(n)`| 两个不匹配列表和结果操作列表最多包含`O(n)`条目。 |

 和`n <= 2 * 10^5`，该算法仅对字符串执行几次线性传递。 其最坏情况下的工作大致与`n`，而不是二次搜索产生的数百亿次检查，因此它完全符合 2 秒的限制。 内存使用量也是线性的，完全在 256 MB 以内。 

## 测试用例

 由于最佳操作序列不是唯一的，因此强大的测试工具不应将成功的输出逐个字符与示例输出进行比较。 相反，它应该验证输出是否具有正确的最小操作数，并且应用这些操作确实会产生相同的字符串。```python
# helper: run solution on input string, return output string
import sys
import io

def solve():
    input = sys.stdin.readline

    n = int(input())
    s = input().strip()
    t = input().strip()

    ab = []
    ba = []

    for i in range(n):
        if s[i] == t[i]:
            continue
        if s[i] == 'a':
            ab.append(i)
        else:
            ba.append(i)

    if (len(ab) + len(ba)) % 2:
        print(-1)
        return

    operations = []

    for i in range(0, len(ab) - 1, 2):
        operations.append((ab[i] + 1, ab[i + 1] + 1))

    for i in range(0, len(ba) - 1, 2):
        operations.append((ba[i] + 1, ba[i + 1] + 1))

    if len(ab) % 2 == 1:
        x = ab[-1] + 1
        y = ba[-1] + 1
        operations.append((x, x))
        operations.append((x, y))

    print(len(operations))
    for x, y in operations:
        print(x, y)

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    try:
        solve()
        return sys.stdout.getvalue()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

def validate(inp: str, out: str):
    data = inp.strip().splitlines()
    n = int(data[0])
    original_s = data[1]
    original_t = data[2]

    lines = out.strip().splitlines()

    if not lines:
        raise AssertionError("empty output")

    if lines[0].strip() == "-1":
        mismatches = sum(a != b for a, b in zip(original_s, original_t))
        assert mismatches % 2 == 1, "reported impossible for a solvable case"
        return

    k = int(lines[0])
    assert len(lines) == k + 1, "wrong number of operation lines"

    ab = []
    ba = []

    for i in range(n):
        if original_s[i] == original_t[i]:
            continue
        if original_s[i] == 'a':
            ab.append(i)
        else:
            ba.append(i)

    expected = len(ab) // 2 + len(ba) // 2
    if len(ab) % 2:
        expected += 2

    assert k == expected, f"not minimum: got {k}, expected {expected}"

    s = list(original_s)
    t = list(original_t)

    for line in lines[1:]:
        x, y = map(int, line.split())
        assert 1 <= x <= n
        assert 1 <= y <= n
        x -= 1
        y -= 1
        s[x], t[y] = t[y], s[x]

    assert s == t, "operations did not make strings equal"

# Provided samples.
sample1 = """4
abab
aabb
"""
validate(sample1, run(sample1))

sample2 = """1
a
b
"""
validate(sample2, run(sample2))

sample3 = """8
babbaabb
abababaa
"""
validate(sample3, run(sample3))

# Minimum-size solvable case: already equal.
case1 = """1
a
a
"""
validate(case1, run(case1))
assert run(case1).strip() == "0"

# Minimum-size impossible case: one mismatch.
case2 = """1
a
b
"""
assert run(case2).strip() == "-1"

# Opposite mismatch types. This catches the special two-operation case.
case3 = """2
ab
ba
"""
validate(case3, run(case3))

# Maximum-size input, with all positions equal.
case4 = "200000\n" + "a" * 200000 + "\n" + "a" * 200000 + "\n"
assert run(case4).strip() == "0"

# Boundary case with two equal mismatch types.
case5 = """4
aabb
bbaa
"""
validate(case5, run(case5))
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 / a / a`|`0`| 最小大小和已经相等的字符串 |
 |`1 / a / b`|`-1`| 最小不可能情况和奇数不匹配计数 |
 |`2 / ab / ba`|`2`运营| 两种不匹配类型发生一次的特殊情况 |
 |`n = 200000`，两个字符串都`a`|`0`| 最大输入大小和线性时间行为 |
 |`4 / aabb / bbaa`|`2`运营| 配对多个相同类型的不匹配 |

 验证器将每个打印的交换应用于字符串的可变副本，然后在最后检查相等性。 它还根据不匹配计数计算理论最小值。 这捕获了碰巧使字符串相等但使用不必要操作的解决方案，以及打印无效索引或不正确的特殊情况序列的解决方案。 

## 边缘情况

 当两个字符串已经相等时，就不存在不匹配的位置。 例如，```
3
aba
aba
```产生空`ab`和`ba`列表。 两个配对循环都执行零次，跳过特殊情况，答案是`0`。 最佳答案不需要或不允许任何操作。 

当不匹配总数为奇数时，答案是不可能的。 为了```
1
a
b
```这`ab`清单是`[0]`和`ba`列表为空。 总数为 1，因此算法打印`-1`在尝试联系合作伙伴之前。 这是由保存总数引起的奇偶条件`a`人物。 

当两种不匹配类型的大小均为奇数时，总不匹配计数为偶数，因此该实例是可解的，但需要特殊的构造。 为了```
2
ab
ba
```名单是`ab = [0]`和`ba = [1]`。 操作`(1, 1)`将第一个位置更改为`ab`到`ba`。 操作`(1, 2)`然后将两者配对`ba`职位。 正好用了两次运算，一次运算无法解决原来相反的方向。 

当不匹配列表的偶数大小大于零时，其中的每个位置都可以成对独立处理。 为了```
4
aabb
bbaa
```不匹配的是`ab`在职位`1`和`2`， 和`ba`在职位`3`和`4`。 算法交换`(1, 2)`对于第一对和`(3, 4)`对于第二对。 每个操作修复两个不匹配，给出两个操作的最小值。 

基于一的索引边界也被显式处理。 在内部，位置`0`代表第一个字符，但每个存储操作在打印之前都会添加一个。 因此，使用索引打印第一个字符的不匹配`1`，而长度的最后一个字符不匹配`n`使用索引打印字符串`n`。 测试工具检查每个生成操作的两个边界。
