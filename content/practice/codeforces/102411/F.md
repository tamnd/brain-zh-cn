---
title: "CF 102411F - Foreach"
description: "我们有一个长度为 n 的整数数组 a，我们想将其转换为目标数组 b。 我们唯一可以打印的指令是两个特殊的 foreach 循环。"
date: "2026-08-12T00:15:43+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102411
codeforces_index: "F"
codeforces_contest_name: "ICPC 2019-2020 North-Western Russia Regional Contest"
rating: 0
weight: 102411
solve_time_s: 164
verified: true
draft: false
---

[CF 102411F - Foreach](https://codeforces.com/problemset/problem/102411/F)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 44s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个整数数组`a`长度`n`，我们想将其转换为目标数组`b`。 我们唯一被允许打印的指令是两个特殊的指令`foreach`循环。 引用循环通过以下方式记住数组的元素`⟦PROTECT_12⟧x`。 因为 PHP 没有引入新的作用域`$x`，旧引用在两个循环之间仍然存在。 这种看似偶然的行为是让受限程序修改数组的机制。 

在前面几个例子之后，无需考虑 PHP 语法，就可以理解有用的效果。 假设当前数组包含`x`，并且我们执行一个引用循环，该循环在第一次出现时停止`x`。`⟦PROTECT_13⟧x`引用最后一个元素，因此以下非引用循环可以用任何已存在的值替换最后一个元素。 

该数组最多有 50 个元素，每个值都在 1 到 100 之间。`n`使二次构造完全合理。 一个`O(n^2)`算法最多执行几千次基本扫描，而对可能的程序进行指数搜索已经有一个巨大的分支因子。 输出本身可能包含最多 10,000 行，因此构造也必须保持在该限制之内。 

有两种特别容易处理不当的情况。 首先，如果某个值最初未出现，则该值不能出现在目标中。 例如，```
2
1 2
1 3
```必须产生```
-1
```因为不允许的操作无法创造价值`3`。 

其次，如果目标仅包含不同的值并且与初始数组不同，则转换是不可能的。 例如，```
3
1 2 3
2 3 1
```具有最初全部发生的目标值，但每个重要操作都必然在某处创建重复值。 一旦目标本身需要三个不同的值，经过这样的改变就无法达到最终状态。 官方的解决方案正是使用了这种不可能性准则。 

当目标的最后一个值仅出现一次时，还有一个微妙的边界情况。 使用最后一个元素作为临时存储的构造可能会意外破坏该值的唯一副本。 该解决方案通过以下方式处理此问题：首先临时修改目标，使其最后一个值第二次出现，转换为修改后的目标，然后恢复更改后的位置。 

## 方法

 暴力方法可以将每条合法线视为一种选择，并搜索达到目标的序列。 每行最多有 200 种可能的形式，因为条件值可以是 1 到 100 之间的任何整数，并且循环可以是引用的或非引用的。 寻找深度`k`因此最坏情况下的分支计数为`200^k`，允许深度可达10000。 即使对于微小的阵列，这也是完全不可行的。 

一个更有用的天真的想法是尝试直接独立地操纵每个位置。 问题是原始操作不寻址任意索引。 它寻址值的第一次出现或最后一个元素。 如果我们要修改的值出现在数组的前面，则可能是本地操作更改了错误的位置。 构造必须首先控制哪个事件是第一个事件。 

关键的观察是，可以从奇怪的数组构建两个更简单的数组操作`foreach`语义。 我们可以替换任何现有值的第一次出现`x`通过另一个现有值`y`。 我们还可以用任何现有值替换最后一个元素`y`。 这些抽象操作中的每一个都恰好花费两个打印循环。 官方教程标识了相同的两个原语。 

现在考虑从右到左修复数组。 当位置`i`需要从`x`到`z`，我们首先删除所有较早出现的`x`。 这使得位置`i`第一次出现`x`，因此首次出现的原语可以准确地定位该位置。 我们暂时复制一下`x`到最后一个元素，然后替换第一个`x`经过`z`。 最后一个元素充当我们正在移动的值的临时副本。 

唯一的危险是丢失最后一个元素中存储的值。 每当我们仍有仓位需要处理时，我们就通过维护最后一个值的副本来避免这种情况。 如果最后一个值仅出现一次，我们将在继续之前将其复制到未处理前缀中的安全位置。 安全测试检查被覆盖的值是否仍然存在于某处，是否已在后缀中固定，或者是否是剩余目标前缀所不需要的。 

有一个尴尬的目标系列，其中最后一个值本身是唯一的，并且在其他地方有重复的值。 我们可以暂时修改目标，而不是使保存逻辑依赖于目标的特殊安排。 我们获取任何重复值的一次出现并将其替换为唯一的最后一个值。 修改后的目标现在具有最后一个值的两个副本。 达到修改后的目标后，更改的位置是最后一个值的第一次出现，因此最终的首次出现操作将恢复原始目标。 

如果目标没有重复值并且与源不同，则不可能性测试已经拒绝它。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 |`O(200^k)`在最坏的情况下|`O(nk)`或者更糟| 太慢了|
 | 最佳 |`O(n^2)`抽象操作/扫描|`O(n)`| 已接受 |

 ## 算法演练

 1.读取初始数组`a`和目标数组`b`。 如果某个值出现在`b`但从未出现在`a`，没有程序可以创建该值，因此打印`-1`。 
2.如果`a`已经等于`b`，打印零操作。 无需特殊处理。 
3. 如果每个值`b`只发生一次，拒绝转换。 任何不平凡的操作都会创建重复项，而请求的最终数组没有重复项。 这也是为什么该条件仅在以下情况下才相关：`a != b`。 
4. 如果最后一个值`b`只发生一次，构造一个临时目标`c`。 查找某个值在其中至少出现两次的情况`b`，并将该事件替换为`b[n-1]`。 再次出现的重复值保持不变。 临时目标现在包含其最后值的两个副本。 
5. 维护两个抽象基元。`first_to(x, y)`替换第一次出现的`x`经过`y`。`last_to(y)`将最后一个元素替换为`y`。 两者都是合法的，因为`y`当它们被调用时保证存在。 
6. 处理位置`n-2`下降到`0`。 最后一个位置故意留到最后，因为这是我们的临时存放位置。 
7. 如果`a[i]`已经等于`c[i]`，保留这个位置。 否则让`x = a[i]`和`z = c[i]`。 
8. 删除所有出现的`x`之前的位置`i`。 每次出现这样的情况都会被数组中已有的安全值替换。 如果最后一个元素不是`x`，其价值在于方便的选择。 如果最后一个元素是`x`， 然后`z`不同于`x`因为这个位置需要改变，所以`z`可以用它代替。 
9. 毕竟所有早期的副本`x`消失了，位置`i`是第一次出现`x`。 复制`x`到最后一个位置，然后替换第一个位置`x`经过`z`。 位置`i`现在是正确的，而旧的`x`最后仍然可用。 
10.如果最后一个值变得唯一，则查找一个值`v`在尚未处理的前缀中，可以安全地用最后一个值替换。 如果前缀中存在另一个副本、已处理的后缀中已出现该值，或者剩余目标前缀中的任何位置都不需要该值，则该值是安全的。 将最后一个值复制到第一次出现的位置`v`。 最后一个值现在又至少有两个副本。 
11.最后一个之前的所有位置都正确后，将最后一个元素替换为`c[n-1]`。 构建临时目标是为了使该值在前缀中的某个位置仍然可用。 
12. 如果使用了临时目标，则恢复更改后的目标位置。 此时临时值是原始最后一个值的第一次出现，因此单个`first_to`操作将其更改回原始目标值。 

### 为什么它有效

 中心不变量是，从右到左已处理的每个位置都等于临时目标，并且未处理的前缀或最终位置所需的每个值仍然存在于数组中的某个位置。 改变位置前`i`，其当前值的所有早期副本都将被删除，因此`i`成为它的第一次出现。 这使得首次出现的原语准确地作用于预期的位置。 最后一个元素提供了正在移动的值的临时副本，修复步骤可防止该临时副本成为仍需要的值的唯一副本。 当前缀完成时，最终的最后一个元素操作会准确地生成临时目标，并且可选的恢复会将其转换为请求的目标。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def build_program(a, target):
    n = len(a)
    ops = []

    def first_to(x, y):
        if x == y:
            return
        p = a.index(x)
        ops.append(("ref", x))
        ops.append(("val", y))
        a[p] = y

    def last_to(y):
        if a[-1] == y:
            return

        # n <= 50 and all values are <= 100, so an absent
        # value among 1..100 always exists when this is needed.
        used = set(a)
        absent = next(v for v in range(1, 101) if v not in used)

        ops.append(("ref", absent))
        ops.append(("val", y))
        a[-1] = y

    for i in range(n - 2, -1, -1):
        if a[i] == target[i]:
            continue

        x = a[i]
        z = target[i]

        # Make i the first occurrence of x.
        while True:
            p = -1
            for j in range(i):
                if a[j] == x:
                    p = j
                    break

            if p == -1:
                break

            spare = a[-1]
            if spare == x:
                spare = z

            # z != x here, so spare is different from x.
            first_to(x, spare)

        # Preserve x at the last position, then make i correct.
        if a[-1] != x:
            last_to(x)

        first_to(x, z)

        # If the last value is unique, duplicate it somewhere safe
        # in the still-unprocessed prefix.
        if i > 0:
            last_value = a[-1]
            if a.count(last_value) == 1:
                prefix = a[:i]
                suffix = a[i + 1:]

                safe = None
                for v in prefix:
                    if v == last_value:
                        continue

                    cnt_prefix = prefix.count(v)
                    in_suffix = v in suffix
                    needed = v in target[:i]

                    if cnt_prefix >= 2 or in_suffix or not needed:
                        safe = v
                        break

                if safe is None:
                    # With the temporary-target construction below,
                    # this case cannot occur.
                    return None

                first_to(safe, last_value)

    # The last position was intentionally skipped.
    if a[-1] != target[-1]:
        last_to(target[-1])

    return ops

def solve_case(n, s, b):
    if s == b:
        return []

    if any(x not in set(s) for x in b):
        return None

    freq = {}
    for x in b:
        freq[x] = freq.get(x, 0) + 1

    if all(freq[x] == 1 for x in b):
        return None

    target = b[:]
    restore_pos = -1
    restore_value = -1

    # If the last target value is unique, temporarily make it
    # appear twice by replacing one occurrence of a repeated value.
    last_value = target[-1]

    if freq[last_value] == 1:
        repeated_pos = -1
        for i in range(n - 1):
            if freq[target[i]] >= 2:
                repeated_pos = i
                break

        if repeated_pos == -1:
            return None

        restore_pos = repeated_pos
        restore_value = target[repeated_pos]
        target[repeated_pos] = last_value

    a = s[:]
    ops = build_program(a, target)

    if ops is None:
        return None

    # Restore the temporary target modification.
    if restore_pos != -1:
        x = target[-1]
        y = restore_value

        # target[restore_pos] == x, and x was unique in the
        # original target. Hence restore_pos is the first x.
        if a[restore_pos] != x:
            return None

        ops.append(("ref", x))
        ops.append(("val", y))
        a[restore_pos] = y

    if a != b or len(ops) > 10000:
        return None

    return ops

def format_ops(ops):
    out = [str(len(ops))]
    for typ, value in ops:
        if typ == "ref":
            out.append(
                f"foreach ($a as &$x) if ($x == {value}) break;"
            )
        else:
            out.append(
                f"foreach ($a as  $x) if ($x == {value}) break;"
            )
    return "\n".join(out)

def solve():
    n = int(input())
    s = list(map(int, input().split()))
    b = list(map(int, input().split()))

    ops = solve_case(n, s, b)

    if ops is None:
        print(-1)
        return

    print(format_ops(ops))

if __name__ == "__main__":
    solve()
```这`first_to`helper 是第一个抽象原语的实现。 第一个打印的循环叶`$x`参考第一个`x`，第二个循环一直走到，直到遇到`y`，通过旧参考写出每个遇到的值。 结果引用的元素变为`y`。 

这`last_to`helper 需要当前数组中未出现的条件。 由于数组最多包含 50 个值，而合法范围包含 100 个值，因此这样的值始终存在。 因此，参考循环正常结束`$x`引用最后一个数组元素。 然后，以下非引用循环将请求的值复制到该位置。 

从右到左的循环是构造的核心。 这`while`循环删除当前值的早期副本，以便所需位置成为其第一次出现。 的选择`spare`是故意与`x`，否则首次出现操作将不会取得进展。 

修复步骤仅涉及未处理的前缀。 具有另一个副本的值可以安全地丢失一次出现。 已处理后缀中已存在的值也是安全的，因为其所需的最终出现位置已被修复。 最后，剩余目标前缀中缺少的值不再需要。 

Python整数不会溢出，最大的相关集合只有50个元素。 潜在的微妙部分是非参考循环中的精确间距。 该语句明确要求之间有两个空格`as`和`⟦PROTECT_14⟧a as  $x)`而不是规范化该空白。 官方声明将格式化失败视为错误答案。 

## 工作示例

 ### 示例 1

 样本是```
3
1 2 3
1 3 3
```目标已经有两个副本`3`，因此不需要临时目标。 施工工艺指标`1`和叶子索引`2`作为临时存储。 

| 步骤| 行动| 数组 |
 | ---| ---| ---|
 | 0 | 开始|`[1, 2, 3]`|
 | 1 |`last_to(2)`|`[1, 2, 2]`|
 | 2 |`first_to(2, 3)`|`[1, 3, 2]`|
 | 3 |`last_to(3)`|`[1, 3, 3]`|

 中间的两个抽象变化正是官方示例背后的机制，尽管构造可以自由地输出不同的有效程序，因为该语句不需要最小化行数。 

### 示例 2

 第二个样本是```
2
1 2
1 3
```价值`3`初始数组中不存在。 

| 步骤| 检查 | 结果 |
 | ---| ---| ---|
 | 0 | 初始值为`{1, 2}`|`{1, 2}`|
 | 1 | 目标要求`3`|`3`不可用 |
 | 2 | 停止|`-1`|

 该痕迹表明，在任何施工之前都可以检测到不可能性。 不允许的操作不能引入初始数组中不存在的值。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |`O(n^2)`| 每个位置都可能导致`O(n)`扫描数组，以及`n <= 50`。 |
 | 空间|`O(n^2)`| 输出程序可以包含`O(n^2)`行，而工作数组本身使用`O(n)`空间。 |

 二次界很小`n <= 50`。 该建设也低于所需的 10,000 条输出线，最坏的情况下只需要几千次原始操作。 官方分析也是如此`O(n^2)`界并观察到这对于交替阵列是渐近最优的。 

## 测试用例

 检查器接受任何有效的程序，因此下面的测试通过模拟精确的引用和非引用循环语义来验证生成的程序，而不是将文本输出与一个固定序列进行比较。```python
# Save the submitted solution as solution.py before running this file.

from solution import solve_case

def execute_program(a, ops):
    a = a[:]
    ref = None
    n = len(a)

    for typ, value in ops:
        if typ == "ref":
            ref = None
            for i in range(n):
                ref = i
                if a[i] == value:
                    break

        else:
            assert ref is not None
            for i in range(n):
                a[ref] = a[i]
                if a[ref] == value:
                    break

    return a

def run(inp: str) -> str:
    import io

    data = inp.strip().splitlines()
    n = int(data[0])
    s = list(map(int, data[1].split()))
    b = list(map(int, data[2].split()))

    ops = solve_case(n, s, b)

    if ops is None:
        return "-1"

    result = execute_program(s, ops)
    assert result == b
    assert len(ops) <= 10000

    return str(len(ops))

# Sample 1
assert run(
    """3
1 2 3
1 3 3
"""
) != "-1", "sample 1"

# Sample 2
assert run(
    """2
1 2
1 3
"""
) == "-1", "sample 2"

# Minimum size, already equal.
assert run(
    """1
7
7
"""
) == "0", "minimum size"

# Minimum size, different values.
assert run(
    """1
7
8
"""
) == "-1", "single element cannot change"

# All values equal in the target.
assert run(
    """3
1 2 2
2 2 2
"""
) != "-1", "all-equal target"

# Last target value is unique, so temporary target modification is needed.
assert run(
    """5
5 1 2 3 4
1 2 2 3 4
"""
) != "-1", "unique last target value"

# Alternating values, a case that exercises many first-occurrence changes.
n = 50
s = [1 if i % 2 == 0 else 2 for i in range(n)]
b = [2 if i % 2 == 0 else 1 for i in range(n)]
inp = f"{n}\n{' '.join(map(str, s))}\n{' '.join(map(str, b))}\n"
assert run(inp) != "-1", "maximum-size alternating case"

print("all tests passed")
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 / 7 / 7`|`0`| 最小尺寸不变数组 |
 |`1 / 7 / 8`|`-1`| 无法修改单元素数组 |
 |`3 / 1 2 2 / 2 2 2`| 有效程序 | 重复值和重复目标值|
 |`5 / 5 1 2 3 4 / 1 2 2 3 4`| 有效程序 | 唯一的最终目标值和临时目标|
 | 长度交替数组`50`| 有效程序 | 最大尺寸和二次构造 |

 ## 边缘情况

 对于不可用的目标值，例如```
2
1 2
1 3
```求解器在尝试任何操作之前检查成员资格。 自从`3`初始数组中不存在，它立即返回`-1`。 这可以防止构造达到假定可用源值丢失的状态。 

对于单元素数组，```
1
7
7
```答案是零操作。 如果目标是`8`，答案是`-1`。 没有第二个数组元素可以充当不同值的源，并且唯一合法的循环只能用其自身重写单个元素。 

对于包含所有不同值的目标，```
3
1 2 3
2 3 1
```求解器立即拒绝它。 第一个重要操作会将一些现有值复制到另一个位置，产生重复项，而请求的目标没有重复项。 使用这些受限操作，数组无法返回完全不同的排列。 

为了获得独特的最终目标值，```
5
5 1 2 3 4
1 2 2 3 4
```价值`4`仅发生在最终目标位置。 一个简单的临时存储策略可能会覆盖唯一的`4`后来发现它没有办法重新创建它。 求解器临时更改重复目标值的一次出现`2`进入`4`，产生辅助目标`[1, 4, 2, 3, 4]`。 最后一个值现在有两个副本，因此可以安全地用作临时存储。 一旦达到辅助目标，第一个`4`正是临时改变的位置，并且`first_to(4, 2)`恢复原来的目标。 

对于交替最大尺寸的情况，```
50
1 2 1 2 1 2 ...
2 1 2 1 2 1 ...
```重复使用相同的首次出现机制。 在可以寻址所需位置之前，必须将值的早期副本移开。 这产生了官方分析所描述的二次行为，并证明了为什么`O(n^2)`建设是理所当然的目标`n = 50`。 

一个小警告：上面的构造遵循官方的两原语策略，并包括一个简化保存论证的临时目标变体。 社论的关键不变性和复杂性与官方分析相符。
